import { Module } from "@nestjs/common";
import {
  GlobalConfigModule,
  PriceUpdaterModule,
  DbModule,
  HealthModule,
} from "./modules";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";

@Module({
  imports: [
    GracefulShutdownModule.forRoot({
      keepNodeProcessAlive: true,
    }),
    GlobalConfigModule,
    HealthModule,
    DbModule,
    PriceUpdaterModule,
  ],
})
export class AppModule {}
