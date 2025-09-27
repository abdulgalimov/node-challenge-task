import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

import * as tokens from "./entities/token.entity";
import * as chains from "./entities/chain.entity";
import * as prices from "./entities/price.entity";
import { PgTransaction } from "drizzle-orm/pg-core";

export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof tokens & typeof chains & typeof prices,
  any
>;
