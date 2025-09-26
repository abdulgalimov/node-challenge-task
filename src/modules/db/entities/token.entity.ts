import { type Static } from "@sinclair/typebox";
import {
  bigint,
  boolean,
  date,
  integer,
  pgTable,
  smallint,
  varchar,
} from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { uuidField, timestamps } from "./fields";
import { createInsertSchema } from "drizzle-typebox";
import { relations } from "drizzle-orm";
import { chainsTable } from "./chain.entity";
import { logosTable } from "./logo.entity";

export const tokensTable = pgTable(
  "tokens",
  {
    id: uuidField(),
    address: varchar().notNull(),
    symbol: varchar().notNull(),
    name: varchar().notNull(),
    decimals: smallint().notNull(),
    isNative: boolean().default(false).notNull(),
    isProtected: boolean().default(false).notNull(),
    lastUpdateAuthor: varchar(),
    priority: integer().default(0).notNull(),
    lastPriceUpdate: date({
      mode: "date",
    }),
    price: bigint({ mode: "bigint" }).notNull(),

    chainId: varchar()
      .references(() => chainsTable.id, { onDelete: "cascade" })
      .notNull(),

    logoId: varchar()
      .references(() => logosTable.id, { onDelete: "cascade" })
      .notNull(),

    ...timestamps,
  },
  (table) => [uniqueIndex("address").on(table.address)]
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

export const tokenInsertSchema = createInsertSchema(tokensTable);

export type TokenInsert = Static<typeof tokenInsertSchema>;
