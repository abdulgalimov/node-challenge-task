import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { MockPriceService } from "./mock-price.service";
import { createTokenPriceUpdateMessage, ProducerService } from "../../kafka";
import { TokenService } from "../../database";
import { TokenData } from "../../../types";

@Injectable()
export class TokenPriceUpdateService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TokenPriceUpdateService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly priceService: MockPriceService,
    private readonly kafkaProducer: ProducerService
  ) {}

  public async onApplicationBootstrap() {
    await this.updatePrices();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updatePrices(): Promise<void> {
    try {
      const tokens = await this.tokenService.find();
      this.logger.log(`Updating prices for ${tokens.length} tokens...`);

      await Promise.all(tokens.map((token) => this.updateTokenPrice(token)));
    } catch (error) {
      this.logger.error(`Error updating prices: ${error.message}`);
    }
  }

  private async updateTokenPrice(token: TokenData): Promise<void> {
    try {
      const oldPrice = token.price;
      const newPrice = await this.priceService.getRandomPriceForToken();

      if (oldPrice === newPrice) {
        return;
      }

      // Create message for Kafka using Zod helper function
      const message = createTokenPriceUpdateMessage({
        tokenId: token.id,
        symbol: token.symbol || "UNKNOWN",
        oldPrice: oldPrice.toString(),
        newPrice: newPrice.toString(),
        // timestamp will be set to current date by default if not provided
      });

      await this.kafkaProducer.sendPriceUpdateMessage(message);

      await this.tokenService.updatePrice(token.id, newPrice);
      this.logger.log(
        `Updated price for ${token.symbol}: ${oldPrice} -> ${newPrice}`
      );
    } catch (error) {
      this.logger.error(
        `Error updating price for token ${token.id}: ${error.message}`
      );
    }
  }
}
