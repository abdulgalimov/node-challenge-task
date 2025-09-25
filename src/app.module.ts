import { Module } from "@nestjs/common";
import {
  GlobalConfigModule,
  DebugModule,
  DatabaseModule,
  TokenUpdateModule,
} from "./modules";

@Module({
  imports: [GlobalConfigModule, DatabaseModule, TokenUpdateModule, DebugModule],
})
export class AppModule {}
