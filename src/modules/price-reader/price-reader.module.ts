import { Module } from "@nestjs/common";
import { PriceReaderService } from "./services";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
  imports: [MetricsModule],
  providers: [PriceReaderService],
  exports: [PriceReaderService],
})
export class PriceReaderModule {}
