import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { MockPriceService, TokenPriceUpdateService } from "./services";
import { KafkaModule } from "../kafka";

@Module({
  imports: [KafkaModule, ScheduleModule.forRoot()],
  providers: [TokenPriceUpdateService, MockPriceService],
})
export class TokenUpdateModule {}
