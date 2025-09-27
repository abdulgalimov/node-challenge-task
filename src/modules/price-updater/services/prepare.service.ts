import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokenService } from "../../db";
import { CommonLogger } from "../../../utils";

@Injectable()
export class PrepareService {
  private readonly logger = new CommonLogger(PrepareService.name);

  constructor(private readonly tokenService: TokenService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updateRequire(): Promise<void> {
    let updateRequiredCount =
      await this.tokenService.getPriceUpdateRequiredCount();

    if (updateRequiredCount === 0) {
      await this.tokenService.priceUpdateRequireAll();

      updateRequiredCount =
        await this.tokenService.getPriceUpdateRequiredCount();

      this.logger.log("Prepare for update", {
        updateRequiredCount,
      });
    }
  }
}
