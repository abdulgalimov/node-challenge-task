import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./modules/database";
import { TokenUpdateModule } from "./modules/token-update";
import { DebugModule } from "./modules/debug";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TokenUpdateModule,
    DebugModule,
  ],
})
export class AppModule {}
