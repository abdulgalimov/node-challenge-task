import { type Static } from "@sinclair/typebox";
import {
  boolean,
  index,
  integer,
  pgTable,
  smallint,
  varchar,
} from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { timestamps, uuidField } from "./fields";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { relations } from "drizzle-orm";
import { chainsTable } from "./chain.entity";
import { logosTable } from "./logo.entity";

export const tokensTable = pgTable(
  "tokens",
  {
    id: uuidField(),
    address: varchar("address").notNull(),
    symbol: varchar("symbol").notNull(),
    name: varchar("name").notNull(),
    decimals: smallint("decimals").notNull(),
    isNative: boolean("is_native").default(false).notNull(),
    isProtected: boolean("is_protected").default(false).notNull(),
    priority: integer("priority").default(0).notNull(),

    priceId: varchar("price_id"),

    priceUpdateRequired: boolean("price_update_required")
      .notNull()
      .default(true),

    chainId: varchar("chain_id")
      .references(() => chainsTable.id, { onDelete: "cascade" })
      .notNull(),

    logoId: varchar("logo_id")
      .references(() => logosTable.id, { onDelete: "cascade" })
      .notNull(),

    ...timestamps(),
  },
  (table) => [
    uniqueIndex("address").on(table.address),
    index("price_update_required").on(table.priceUpdateRequired),
  ]
);

export const tokensTableRelations = relations(tokensTable, ({ one }) => ({
  chain: one(chainsTable, {
    fields: [tokensTable.chainId],
    references: [chainsTable.id],
  }),
  logo: one(logosTable, {
    fields: [tokensTable.logoId],
    references: [logosTable.id],
  }),
}));

export const TokenInsert = createInsertSchema(tokensTable);

export type TokenInsert = Static<typeof TokenInsert>;

export const TokenSelect = createSelectSchema(tokensTable);

export type TokenSelect = Static<typeof TokenSelect>;
