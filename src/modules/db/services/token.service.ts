import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Value } from "@sinclair/typebox/value";
import { eq, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import * as tokens from "../entities/token.entity";
import { DB_CLIENT } from "../constants";
import {
  TokenInsert,
  tokenInsertSchema,
  TokenSelect,
  tokenSelectSchema,
} from "../entities";
import { Transaction } from "../types";

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

  public async getPriceUpdateRequiredCount(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tokens.tokensTable)
      .where(eq(tokens.tokensTable.priceUpdateRequired, true));

    return result[0] ? +result[0].count : 0;
  }

  public async priceUpdateRequireAll(): Promise<number> {
    const result = await this.db.update(tokens.tokensTable).set({
      priceUpdateRequired: true,
    });

    return result.rowCount || 0;
  }

  public async priceUpdated(tx: Transaction, id: string) {
    await tx
      .update(tokens.tokensTable)
      .set({
        priceUpdateRequired: false,
      })
      .where(eq(tokens.tokensTable.id, id));
  }

  public async getUpdateRequired(
    tx: Transaction,
    limit: number
  ): Promise<TokenSelect[]> {
    const { rows } = await tx.execute<{ id: string }>(
      sql`SELECT id FROM tokens WHERE price_update_required = true LIMIT ${limit};`
    );

    return Promise.all(rows.map((row) => this.getByIdSafe(row.id)));
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

    return Value.Parse(tokenSelectSchema, item);
  }

  public async getByIdSafe(id: string): Promise<TokenSelect> {
    const result = await this.getById(id);

    if (!result) {
      throw new Error("Token not found");
    }

    return result;
  }

  public async getAll(): Promise<TokenSelect[]> {
    return await this.db.select().from(tokens.tokensTable).execute();
  }

  public async createList(dataList: TokenInsert[]) {
    dataList.forEach((item) => Value.Parse(tokenInsertSchema, item));

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
