import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { UpdateService, PrepareService } from "./services";
import { KafkaModule } from "../kafka";
import { PriceReaderModule } from "../price-reader";

@Module({
  imports: [KafkaModule, PriceReaderModule, ScheduleModule.forRoot()],
  providers: [UpdateService, PrepareService],
})
export class PriceUpdaterModule {}
