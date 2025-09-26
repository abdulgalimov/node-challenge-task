import { Module } from "@nestjs/common";
import { GlobalConfigModule, TokenUpdateModule, DbModule } from "./modules";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";

@Module({
  imports: [
    GracefulShutdownModule.forRoot({
      keepNodeProcessAlive: true,
    }),
    GlobalConfigModule,
    DbModule,
    TokenUpdateModule,
  ],
})
export class AppModule {}
