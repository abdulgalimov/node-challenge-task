import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as tokensTable from "./entities/token.entity";
import * as chainsTable from "./entities/chain.entity";
import * as logosTable from "./entities/logo.entity";
import * as pricesTable from "./entities/price.entity";
import { DbConfig } from "../config";

export function createDbClient(dbConfig: DbConfig) {
  const { connectionUrl } = dbConfig;
  const pool = new Pool({
    connectionString: connectionUrl,
  });
  return drizzle({
    client: pool,
    schema: { ...tokensTable, ...chainsTable, ...logosTable, ...pricesTable },
  });
}
