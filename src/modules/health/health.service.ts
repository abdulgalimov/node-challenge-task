import { Inject, Injectable } from "@nestjs/common";

import { DbHealthService } from "../db";
import { ProducerService } from "../kafka";

@Injectable()
export class HealthService {
  constructor(
    @Inject(DbHealthService) private readonly dbHealthService: DbHealthService,
    @Inject(ProducerService) private readonly kafkaService: ProducerService
  ) {}

  public async isReady(): Promise<boolean> {
    const dbReady = await this.dbHealthService.isReady();

    const kafkaReady = this.kafkaService.isReady();

    return dbReady && kafkaReady;
  }
}
