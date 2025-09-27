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

    const waitingUpdateCount =
      await this.tokenService.waitingPriceUpdateCount();

    if (waitingUpdateCount > 0) {
      return;
    }

    this.logger.log("Start preparing for update");

    const waitingCount = await this.tokenService.waitPriceUpdateAll();

    this.logger.log("Prepare for update", {
      waitingCount,
    });

    this.task.resolve();
  }
}
