import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DB_PROVIDE } from "./constants";
import { DbConfig } from "../../types";
import { ChainService, LogoService, TokenService } from "./services";
import { createDbClient } from "./create-client";

@Module({
  providers: [
    {
      provide: DB_PROVIDE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DbConfig>("db");

        return createDbClient(dbConfig);
      },
    },
    TokenService,
    ChainService,
    LogoService,
  ],
  exports: [TokenService, ChainService, LogoService],
})
@Global()
export class DbModule {}
