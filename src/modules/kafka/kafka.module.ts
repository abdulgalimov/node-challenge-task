import { Global, Module } from "@nestjs/common";
import { ProducerService } from "./services";

@Module({
  imports: [],
  providers: [ProducerService],
  exports: [ProducerService],
})
@Global()
export class KafkaModule {}
