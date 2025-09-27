import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as prices from "../entities/price.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CLIENT } from "../constants";
import { Transaction } from "../types";
import { PriceSelect } from "../entities";
import { eq } from "drizzle-orm";
import { Value } from "@sinclair/typebox/value";

@Injectable()
export class PriceService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: NodePgDatabase<typeof prices>
  ) {}

  public async getById(id: string): Promise<PriceSelect | null> {
    const result = await this.db
      .select()
      .from(prices.pricesTable)
      .where(eq(prices.pricesTable.id, id));

    const item = result[0];

    return item ? Value.Parse(PriceSelect, item) : null;
  }

  public async updatePrice(
    tx: Transaction,
    tokenId: string,
    lastPrice: bigint,
    lastUpdateAuthor: string
  ) {
    await tx
      .insert(prices.pricesTable)
      .values({
        tokenId,
        lastPrice,
        lastUpdateAuthor,
      })
      .onConflictDoUpdate({
        target: prices.pricesTable.tokenId,
        set: {
          lastPrice,
          lastUpdateAuthor,
          updatedAt: new Date(),
        },
      });
  }
}
