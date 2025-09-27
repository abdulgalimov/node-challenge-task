import { boolean, serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import type { Static } from "@sinclair/typebox";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { uuidField, timestamps } from "./fields";

export const chainsTable = pgTable(
  "chains",
  {
    id: uuidField(),
    deId: serial("deid").notNull().unique(),
    name: varchar("name").notNull(),
    isEnabled: boolean("is_enabled").default(false).notNull(),

    ...timestamps(),
  },
  (table) => [uniqueIndex("name").on(table.name)]
);

export const chainInsertSchema = createInsertSchema(chainsTable);
export const chainSelectSchema = createSelectSchema(chainsTable);

export type ChainInsert = Static<typeof chainInsertSchema>;
export type ChainSelect = Static<typeof chainSelectSchema>;
