import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { ProducerService, TokenPriceUpdateMessageCreate } from "../../kafka";
import {
  PriceService,
  TokenService,
  Transaction,
  TransactionsService,
  WaitUpdateSelect,
} from "../../db";
import { CommonLogger, Task } from "../../../utils";
import { PriceReaderService } from "../../price-reader/services";
import { DurationMetric } from "../../metrics";

@Injectable()
export class UpdateService implements OnApplicationShutdown {
  private readonly logger = new CommonLogger(UpdateService.name);

  private readonly task: Task = new Task();

  public readonly maxLoadLimit = 1000;

  constructor(
    private readonly tokenService: TokenService,
    private readonly priceService: PriceService,
    private readonly transactionsService: TransactionsService,
    private readonly priceReaderService: PriceReaderService,
    private readonly kafkaProducer: ProducerService
  ) {}

  public async onApplicationShutdown() {
    if (this.task.isActive()) {
      await this.task.readyPromise();
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updateRequire(): Promise<void> {
    if (this.task.isActive()) {
      return;
    }

    this.task.create();

    await this.updatePrices();

    this.task.resolve();
  }

  @DurationMetric({
    name: "update_tokens_prices",
    help: "Duration of update all tokens prices in seconds",
  })
  public async updatePrices(): Promise<void> {
    this.logger.log("Start update prices");
    const updatedCount = await this.transactionsService.create(async (tx) => {
      const tokens = await this.tokenService.getWaitUpdate(
        tx,
        this.maxLoadLimit
      );

      if (!tokens.length) {
        return 0;
      }

      const updateResponses = await Promise.all(
        tokens.map(async (token) => this.updateTokenPriceSafe(tx, token))
      );

      const responsesFiltered = updateResponses.filter((res) => res != null);

      await this.kafkaProducer.sendBatch(responsesFiltered);

      return tokens.length;
    });

    const totalTokensCount = await this.tokenService.count();
    const updatedPriceCount = await this.tokenService.updatedPriceCount();

    this.logger.log("Update prices complete", {
      updatedPriceCount,
      totalTokensCount,
    });

    if (updatedCount > 0) {
      await this.updatePrices();
    }
  }

  private async updateTokenPriceSafe(
    tx: Transaction,
    token: WaitUpdateSelect
  ): Promise<TokenPriceUpdateMessageCreate | null> {
    try {
      return await this.updateTokenPrice(tx, token);
    } catch (error: unknown) {
      this.logger.error(`Error updating price for token`, {
        token,
        error,
      });

      return null;
    } finally {
      await this.tokenService.priceUpdated(tx, token.id);
    }
  }

  private async updateTokenPrice(
    tx: Transaction,
    token: WaitUpdateSelect
  ): Promise<TokenPriceUpdateMessageCreate | null> {
    const oldPrice = token.priceId
      ? await this.priceService.getById(token.priceId)
      : null;

    const oldPriceValue = oldPrice ? oldPrice.lastPrice : null;

    const newPriceResponse = await this.priceReaderService.getTokenPrice();

    if (oldPriceValue === newPriceResponse.price) {
      return null;
    }

    await this.priceService.updatePrice(
      tx,
      token.id,
      newPriceResponse.price,
      newPriceResponse.author
    );

    return {
      tokenId: token.id,
      symbol: token.symbol,
      oldPrice: oldPriceValue ? oldPriceValue.toString() : null,
      newPrice: newPriceResponse.price.toString(),
    };
  }
}
