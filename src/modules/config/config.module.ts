import { ConfigModule } from "@nestjs/config";
import { loadConfig } from "./loader";

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
