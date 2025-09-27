import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { Value } from "@sinclair/typebox/value";

import * as chains from "../entities/chain.entity";
import { ChainInsert, ChainSelect } from "../entities";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CLIENT } from "../constants";
import { ChainNames } from "../../../enums";

@Injectable()
export class ChainService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: NodePgDatabase<typeof chains>
  ) {}

  public async count(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(chains.chainsTable);

    return result[0] ? +result[0].count : 0;
  }

  public async findByName(name: ChainNames): Promise<ChainSelect | null> {
    const result = await this.db
      .select()
      .from(chains.chainsTable)
      .where(eq(chains.chainsTable.name, name));

    const item = result[0];

    return item ? Value.Parse(ChainSelect, item) : null;
  }

  public async createList(dataList: ChainInsert[]) {
    dataList.forEach((item) => Value.Parse(ChainInsert, item));

    await this.db
      .insert(chains.chainsTable)
      .values(dataList)
      .onConflictDoUpdate({
        target: chains.chainsTable.name,
        set: {
          isEnabled: chains.chainsTable.isEnabled,
        },
      });
  }
}
