import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokenService } from "../../db";
import { CommonLogger, Task } from "../../../utils";

@Injectable()
export class PrepareService {
  private readonly logger = new CommonLogger(PrepareService.name);

  private readonly task: Task = new Task();

  constructor(private readonly tokenService: TokenService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async updateRequire(): Promise<void> {
    if (this.task.isActive()) {
      return;
    }

    const updateRequiredCount =
      await this.tokenService.getPriceUpdateRequiredCount();

    if (updateRequiredCount > 0) {
      return;
    }

    this.logger.log("Start preparing for update");

    const requiredCount = await this.tokenService.priceUpdateRequireAll();

    this.logger.log("Prepare for update", {
      requiredCount,
    });

    this.task.resolve();
  }
}
