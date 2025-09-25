import { Module } from "@nestjs/common";
import { MockPriceService, TokenPriceUpdateService } from "./services";
import { KafkaModule } from "../kafka";

@Module({
  imports: [KafkaModule],
  providers: [TokenPriceUpdateService, MockPriceService],
})
export class TokenUpdateModule {}
