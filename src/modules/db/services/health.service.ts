import { Inject, Injectable } from "@nestjs/common";
import { DB_PROVIDE } from "../constants";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as chains from "../entities/chain.entity";
import { sql } from "drizzle-orm";

@Injectable()
export class DbHealthService {
  public constructor(
    @Inject(DB_PROVIDE) private readonly db: NodePgDatabase<typeof chains>
  ) {}

  public async isReady(): Promise<boolean> {
    try {
      await this.db.execute(sql`select 1`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
