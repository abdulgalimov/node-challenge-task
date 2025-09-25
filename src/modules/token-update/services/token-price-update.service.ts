import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { MockPriceService } from "./mock-price.service";
import { ProducerService, TokenPriceUpdateMessageCreate } from "../../kafka";
import { TokenService } from "../../database";
import { TokenData } from "../../../types";
import { UpdatePriceResponse } from "./types";

@Injectable()
export class TokenPriceUpdateService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TokenPriceUpdateService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly priceService: MockPriceService,
    private readonly kafkaProducer: ProducerService
  ) {}

  public async onApplicationBootstrap() {
    await this.updatePricesSafe();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updatePricesSafe(): Promise<void> {
    try {
      await this.updatePrices();
    } catch (error: unknown) {
      this.logger.error(`Error updating prices`, {
        error,
      });
    }
  }

  public async updatePrices(): Promise<void> {
    const tokens = await this.tokenService.getAll();
    this.logger.log(`Updating prices for ${tokens.length} tokens...`);

    const responses = await Promise.all(
      tokens.map((token) => this.updateTokenPriceSafe(token))
    );

    const updateMessages: TokenPriceUpdateMessageCreate[] = responses
      .filter((response) => response != null)
      .map((response) => {
        const { newToken, oldPrice } = response;
        return {
          tokenId: newToken.id,
          symbol: newToken.symbol || "UNKNOWN",
          oldPrice: oldPrice.toString(),
          newPrice: newToken.price.toString(),
          // timestamp will be set to current date by default if not provided
        };
      });

    await this.kafkaProducer.sendBatch(updateMessages);
  }

  private async updateTokenPriceSafe(
    token: TokenData
  ): Promise<UpdatePriceResponse | null> {
    try {
      return await this.updateTokenPrice(token);
    } catch (error: unknown) {
      this.logger.error(`Error updating price for token ${token.id}`, {
        error,
      });

      return null;
    }
  }

  private async updateTokenPrice(
    token: TokenData
  ): Promise<UpdatePriceResponse | null> {
    const oldPrice = token.price;
    const newPrice = await this.priceService.getRandomPriceForToken();

    if (oldPrice === newPrice) {
      return null;
    }

    const newToken = await this.tokenService.updatePrice(token.id, newPrice);

    this.logger.log(
      `Updated price for ${token.symbol}: ${oldPrice} -> ${newPrice}`
    );

    return {
      newToken,
      oldPrice: token.price,
    };
  }
}
