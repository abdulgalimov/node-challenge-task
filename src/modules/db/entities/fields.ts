import { timestamp, varchar } from "drizzle-orm/pg-core";
import { generateUUID } from "../../../utils";

export function uuidField() {
  return varchar("id")
    .primaryKey()
    .$defaultFn(() => generateUUID())
    .primaryKey();
}

export function timestamps() {
  return {
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  };
}
