import { timestamp, varchar } from "drizzle-orm/pg-core";
import { generateUUID } from "../../../utils";

export const timestamps = {
  updatedAt: timestamp().$onUpdate(() => new Date()),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};

export const uuidField = () =>
  varchar()
    .primaryKey()
    .$defaultFn(() => generateUUID())
    .primaryKey();
