import { Module } from "@nestjs/common";
import {
  GlobalConfigModule,
  TokenUpdateModule,
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
    TokenUpdateModule,
  ],
})
export class AppModule {}
