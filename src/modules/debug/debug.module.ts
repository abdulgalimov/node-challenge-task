import { Module } from "@nestjs/common";
import { TokenSeeder } from "./services";

@Module({
  providers: [TokenSeeder],
})
export class DebugModule {}
