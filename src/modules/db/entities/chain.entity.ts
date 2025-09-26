import { boolean, serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import type { Static } from "@sinclair/typebox";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

import { uuidField, timestamps } from "./fields";

export const chainsTable = pgTable(
  "chains",
  {
    id: uuidField(),
    deId: serial().notNull().unique(),
    name: varchar().notNull(),
    isEnabled: boolean().default(false).notNull(),

    ...timestamps,
  },
  (table) => [uniqueIndex("name").on(table.name)]
);

export const chainInsertSchema = createInsertSchema(chainsTable);

export type ChainInsert = Static<typeof chainInsertSchema>;
