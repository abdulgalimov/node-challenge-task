import { pgTable, varchar } from "drizzle-orm/pg-core";

import { uuidField, timestamps } from "./fields";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";
import type { Static } from "@sinclair/typebox";

export const logosTable = pgTable(
  "logos",
  {
    id: uuidField(),
    bigRelativePath: varchar("big_relative_path").notNull(),
    smallRelativePath: varchar("small_relative_path").notNull(),
    thumbRelativePath: varchar("thumb_relative_path").notNull(),

    ...timestamps(),
  },
  (table) => [
    uniqueIndex("all_path").on(
      table.bigRelativePath,
      table.smallRelativePath,
      table.thumbRelativePath
    ),
  ]
);

export const logoInsertSchema = createInsertSchema(logosTable);

export const logoSelectSchema = createSelectSchema(logosTable);

export type LogoInsert = Static<typeof logoInsertSchema>;

export type LogoSelect = Static<typeof logoSelectSchema>;
