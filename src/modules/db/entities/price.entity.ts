import { type Static } from "@sinclair/typebox";
import { bigint, date, pgTable, varchar } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { timestamps, uuidField } from "./fields";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { tokensTable } from "./token.entity";

export const pricesTable = pgTable(
  "prices",
  {
    id: uuidField(),
    lastUpdatedAt: date("last_updated_at", {
      mode: "date",
    }).notNull(),
    lastUpdateAuthor: varchar("last_update_author").notNull(),
    lastPrice: bigint("last_price", { mode: "bigint" }).notNull(),

    tokenId: varchar("token_id")
      .references(() => tokensTable.id, { onDelete: "cascade" })
      .notNull(),

    ...timestamps(),
  },
  (table) => [uniqueIndex("token_id").on(table.tokenId)]
);

export const priceInsertSchema = createInsertSchema(pricesTable);

export const priceSelectSchema = createSelectSchema(pricesTable);

export type PriceInsert = Static<typeof priceInsertSchema>;

export type PriceSelect = Static<typeof priceSelectSchema>;
