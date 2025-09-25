import { Module } from "@nestjs/common";
import { ProducerService } from "./services";

@Module({
  imports: [],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
