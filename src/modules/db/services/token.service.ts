import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Value } from "@sinclair/typebox/value";
import { eq, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import * as tokens from "../entities/token.entity";
import { DB_PROVIDE } from "../constants";
import { TokenInsert, tokenInsertSchema } from "../entities";
import { Token } from "../../../types";

@Injectable()
export class TokenService {
  constructor(
    @Inject(DB_PROVIDE) private readonly db: NodePgDatabase<typeof tokens>
  ) {}

  public async count(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tokens.tokensTable);

    return result[0] ? +result[0].count : 0;
  }

  public async getAll(): Promise<Token[]> {
    return await this.db.select().from(tokens.tokensTable).execute();
  }

  public async createList(dataList: TokenInsert[]) {
    dataList.forEach((item) => Value.Parse(tokenInsertSchema, item));

    await this.db
      .insert(tokens.tokensTable)
      .values(dataList)
      .onConflictDoUpdate({
        target: tokens.tokensTable.address,
        set: {
          symbol: tokens.tokensTable.symbol,
          name: tokens.tokensTable.name,
          isNative: tokens.tokensTable.isNative,
          isProtected: tokens.tokensTable.isProtected,
          lastUpdateAuthor: tokens.tokensTable.lastUpdateAuthor,
          lastPriceUpdate: tokens.tokensTable.lastPriceUpdate,
          priority: tokens.tokensTable.priority,
          price: tokens.tokensTable.price,
          chainId: tokens.tokensTable.chainId,
        },
      });
  }

  public async updatePrice(id: string, price: bigint): Promise<Token | null> {
    await this.db
      .update(tokens.tokensTable)
      .set({
        price,
      })
      .where(eq(tokens.tokensTable.id, id));
    return null;
  }
}
