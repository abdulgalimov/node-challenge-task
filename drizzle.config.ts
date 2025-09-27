import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/modules/db/entities/token.entity.ts",
    "./src/modules/db/entities/logo.entity.ts",
    "./src/modules/db/entities/chain.entity.ts",
    "./src/modules/db/entities/price.entity.ts",
  ],
  out: "./src/modules/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
