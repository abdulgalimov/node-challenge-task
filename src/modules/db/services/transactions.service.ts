import { Inject, Injectable } from "@nestjs/common";
import { DB_CLIENT } from "../constants";
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";

import * as tokens from "../entities/token.entity";
import * as chains from "../entities/chain.entity";
import * as prices from "../entities/price.entity";
import { PgTransaction } from "drizzle-orm/pg-core";

export type Tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof tokens & typeof chains & typeof prices,
  any
>;

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DB_CLIENT)
    public readonly db: NodePgDatabase<
      typeof tokens & typeof chains & typeof prices
    >
  ) {}
}
