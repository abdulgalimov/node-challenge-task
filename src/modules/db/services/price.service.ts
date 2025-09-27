import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as prices from "../entities/price.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CLIENT } from "../constants";
import { Tx } from "./transactions.service";

@Injectable()
export class PriceService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: NodePgDatabase<typeof prices>
  ) {}

  public async updatePrice(tx: Tx, tokenId: string, lastPrice: bigint) {
    const lastUpdatedAt = new Date();
    await tx
      .insert(prices.pricesTable)
      .values({
        tokenId,
        lastPrice,
        lastUpdatedAt,
        lastUpdateAuthor: "none",
      })
      .onConflictDoUpdate({
        target: prices.pricesTable.tokenId,
        set: {
          lastPrice,
          lastUpdatedAt,
          lastUpdateAuthor: "none",
        },
      });
  }
}
