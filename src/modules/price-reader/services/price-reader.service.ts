import { Injectable } from "@nestjs/common";
import { ReadPriceResponse } from "../types";
import { DurationMetric } from "../../metrics";

@Injectable()
export class PriceReaderService {
  @DurationMetric({
    name: "get_token_price",
    help: "Duration of get tokens price in seconds",
  })
  async getTokenPrice(): Promise<ReadPriceResponse> {
    // Simulate API call delay
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.getRandomInt(50, 200));
    });

    const basePrice = this.getRandomInt(1, 100000);
    const randomFactor = Math.floor(Math.random() * 10);

    return {
      price: BigInt(basePrice) * BigInt(randomFactor),
      author: "mock",
    };
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
