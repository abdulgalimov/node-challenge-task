import { Inject, Injectable } from "@nestjs/common";
import { DB_CLIENT } from "../constants";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as tokens from "../entities/token.entity";
import * as chains from "../entities/chain.entity";
import * as prices from "../entities/price.entity";
import { Transaction } from "../types";

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DB_CLIENT)
    private readonly db: NodePgDatabase<
      typeof tokens & typeof chains & typeof prices
    >
  ) {}

  public async create<T = unknown>(
    callback: (tx: Transaction) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(callback);
  }
}
