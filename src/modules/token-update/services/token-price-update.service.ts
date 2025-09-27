import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { MockPriceService } from "./mock-price.service";
import { ProducerService, TokenPriceUpdateMessageCreate } from "../../kafka";
import { PriceService, TokenService, TransactionsService, Tx } from "../../db";
import { Token } from "../../../types";
import { CommonLogger, Task } from "../../../utils";

@Injectable()
export class TokenPriceUpdateService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new CommonLogger(TokenPriceUpdateService.name);

  private activeTask: Task | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly priceService: PriceService,
    private readonly transactionsService: TransactionsService,
    private readonly readPriceService: MockPriceService,
    private readonly kafkaProducer: ProducerService
  ) {}

  public async onApplicationBootstrap() {
    //
  }

  public async onApplicationShutdown() {
    if (this.activeTask) {
      await this.activeTask.readyPromise;
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updateRequire(): Promise<void> {
    if (this.activeTask) {
      return;
    }
    this.activeTask = new Task();

    const updateRequiredCount =
      await this.tokenService.getPriceUpdateRequiredCount();

    if (updateRequiredCount === 0) {
      await this.tokenService.priceUpdateRequireAll();
    } else {
      await this.updatePrices();
    }

    this.activeTask.resolve();
    this.activeTask = null;
  }

  public async updatePrices(): Promise<void> {
    const updatedCount = await this.transactionsService.db.transaction(
      async (tx) => {
        const tokens = await this.tokenService.getUpdateRequired(tx, 1000);
        if (!tokens.length) {
          return 0;
        }

        const updateResponses = await Promise.all(
          tokens.map(async (token) => this.updateTokenPriceSafe(tx, token))
        );

        const responsesFiltered = updateResponses.filter((res) => res != null);

        await this.kafkaProducer.sendBatch(responsesFiltered);

        return tokens.length;
      }
    );

    if (updatedCount > 0) {
      await this.updatePrices();
    }
  }

  private async updateTokenPriceSafe(
    tx: Tx,
    token: Token
  ): Promise<TokenPriceUpdateMessageCreate | null> {
    try {
      return await this.updateTokenPrice(tx, token);
    } catch (error: unknown) {
      this.logger.error(`Error updating price for token ${token.id}`, {
        error,
      });

      return null;
    } finally {
      await this.tokenService.priceUpdated(tx, token.id);
    }
  }

  private async updateTokenPrice(
    tx: Tx,
    token: Token
  ): Promise<TokenPriceUpdateMessageCreate | null> {
    const oldPrice = 0n;
    const newPrice = await this.readPriceService.getRandomPriceForToken();

    if (oldPrice === newPrice) {
      return null;
    }

    await this.priceService.updatePrice(tx, token.id, newPrice);

    this.logger.log(
      `Updated price for ${token.id}: ${oldPrice} -> ${newPrice}`
    );

    return {
      tokenId: token.id,
      symbol: token.symbol,
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
    };
  }
}
