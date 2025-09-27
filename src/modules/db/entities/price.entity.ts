import { type Static } from "@sinclair/typebox";
import { bigint, pgTable, varchar } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { timestamps, uuidField } from "./fields";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { tokensTable } from "./token.entity";

export const pricesTable = pgTable(
  "prices",
  {
    id: uuidField(),
    lastUpdateAuthor: varchar("last_update_author").notNull(),
    lastPrice: bigint("last_price", { mode: "bigint" }).notNull(),

    tokenId: varchar("token_id")
      .references(() => tokensTable.id, { onDelete: "cascade" })
      .notNull(),

    ...timestamps(),
  },
  (table) => [uniqueIndex("token_id").on(table.tokenId)]
);

export const PriceInsert = createInsertSchema(pricesTable);

export type PriceInsert = Static<typeof PriceInsert>;

export const PriceSelect = createSelectSchema(pricesTable);

export type PriceSelect = Static<typeof PriceSelect>;
