import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DB_CLIENT } from "./constants";
import { DbConfig } from "../../types";
import {
  ChainService,
  DbHealthService,
  LogoService,
  PriceService,
  TokenService,
  TransactionsService,
} from "./services";
import { createDbClient } from "./create-client";

@Module({
  providers: [
    {
      provide: DB_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DbConfig>("db");

        return createDbClient(dbConfig);
      },
    },
    ChainService,
    TokenService,
    PriceService,
    LogoService,
    DbHealthService,
    TransactionsService,
  ],
  exports: [
    ChainService,
    TokenService,
    PriceService,
    LogoService,
    DbHealthService,
    TransactionsService,
  ],
})
@Global()
export class DbModule {}
