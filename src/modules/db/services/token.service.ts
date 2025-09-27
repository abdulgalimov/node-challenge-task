import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Value } from "@sinclair/typebox/value";
import { eq, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import * as tokens from "../entities/token.entity";
import { DB_CLIENT } from "../constants";
import { TokenInsert, TokenSelect } from "../entities";
import { Transaction } from "../types";
import { WaitUpdateSelect } from "../entities/token.entity";

@Injectable()
export class TokenService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: NodePgDatabase<typeof tokens>
  ) {}

  public async count(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tokens.tokensTable);

    return result[0] ? +result[0].count : 0;
  }

  public async waitingPriceUpdateCount(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tokens.tokensTable)
      .where(eq(tokens.tokensTable.waitPriceUpdate, true));

    return result[0] ? +result[0].count : 0;
  }

  public async updatedPriceCount(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tokens.tokensTable)
      .where(eq(tokens.tokensTable.waitPriceUpdate, false));

    return result[0] ? +result[0].count : 0;
  }

  public async waitPriceUpdateAll(): Promise<number> {
    const result = await this.db.update(tokens.tokensTable).set({
      waitPriceUpdate: true,
    });

    return result.rowCount || 0;
  }

  public async priceUpdated(tx: Transaction, id: string) {
    await tx
      .update(tokens.tokensTable)
      .set({
        waitPriceUpdate: false,
      })
      .where(eq(tokens.tokensTable.id, id));
  }

  public async getWaitUpdate(
    tx: Transaction,
    limit: number
  ): Promise<WaitUpdateSelect[]> {
    const { rows } = await tx.execute<{ id: string }>(
      sql`SELECT id,price_id as "priceId",symbol FROM tokens WHERE wait_price_update = true FOR UPDATE SKIP LOCKED LIMIT ${limit};`
    );

    return rows.map((row) => Value.Parse(WaitUpdateSelect, row));
  }

  public async getById(id: string): Promise<TokenSelect | null> {
    const result = await this.db
      .select()
      .from(tokens.tokensTable)
      .where(eq(tokens.tokensTable.id, id));

    const item = result[0];
    if (!item) {
      return null;
    }

    return Value.Parse(TokenSelect, item);
  }

  public async getByIdSafe(id: string): Promise<TokenSelect> {
    const result = await this.getById(id);

    if (!result) {
      throw new Error("Token not found");
    }

    return result;
  }

  public async createList(dataList: TokenInsert[]) {
    dataList.forEach((item) => Value.Parse(TokenInsert, item));

    const maxCount = 5000;
    for (let i = 0; i < dataList.length; i += maxCount) {
      await this.db
        .insert(tokens.tokensTable)
        .values(dataList.slice(i, i + maxCount))
        .onConflictDoUpdate({
          target: tokens.tokensTable.address,
          set: {
            symbol: tokens.tokensTable.symbol,
            name: tokens.tokensTable.name,
            isNative: tokens.tokensTable.isNative,
            isProtected: tokens.tokensTable.isProtected,
            priority: tokens.tokensTable.priority,
            chainId: tokens.tokensTable.chainId,
          },
        });
    }
  }
}
