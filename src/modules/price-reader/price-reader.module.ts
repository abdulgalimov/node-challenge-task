import { Module } from "@nestjs/common";
import { PriceReaderService } from "./services";

@Module({
  providers: [PriceReaderService],
  exports: [PriceReaderService],
})
export class PriceReaderModule {}
