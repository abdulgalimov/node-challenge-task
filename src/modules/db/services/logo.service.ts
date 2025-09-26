import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, eq } from "drizzle-orm";
import { Value } from "@sinclair/typebox/value";

import * as logos from "../entities/logo.entity";
import { logoInsertSchema } from "../entities";
import { Inject, Injectable } from "@nestjs/common";
import { DB_PROVIDE } from "../constants";
import { Logo, LogoInfo } from "../../../types";

@Injectable()
export class LogoService {
  constructor(
    @Inject(DB_PROVIDE) private readonly db: NodePgDatabase<typeof logos>
  ) {}

  public async get(logo: LogoInfo): Promise<Logo> {
    Value.Parse(logoInsertSchema, logo);

    await this.db
      .insert(logos.logosTable)
      .values(logo)
      .onConflictDoUpdate({
        target: [
          logos.logosTable.bigRelativePath,
          logos.logosTable.smallRelativePath,
          logos.logosTable.thumbRelativePath,
        ],
        set: {
          updatedAt: new Date(),
        },
      });

    const result = await this.db
      .select()
      .from(logos.logosTable)
      .where(
        and(
          eq(logos.logosTable.bigRelativePath, logo.bigRelativePath),
          eq(logos.logosTable.smallRelativePath, logo.smallRelativePath),
          eq(logos.logosTable.thumbRelativePath, logo.thumbRelativePath)
        )
      );

    const item = result[0];
    if (!item) {
      throw new Error("Failed get logo after insert");
    }

    return Value.Parse(Logo, item);
  }
}
