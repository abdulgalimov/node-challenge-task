import { pgTable, varchar } from "drizzle-orm/pg-core";

import { uuidField, timestamps } from "./fields";
import { createInsertSchema } from "drizzle-typebox";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

export const logosTable = pgTable(
  "logos",
  {
    id: uuidField(),
    bigRelativePath: varchar().notNull(),
    smallRelativePath: varchar().notNull(),
    thumbRelativePath: varchar().notNull(),

    ...timestamps,
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
