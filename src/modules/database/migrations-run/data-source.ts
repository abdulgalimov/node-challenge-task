import { DataSource } from "typeorm";
import { InitialMigration1684654321000 } from "../migrations/1684654321000-InitialMigration";
import { TokenEntity } from "../index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "tokens",
  entities: [TokenEntity],
  migrations: [InitialMigration1684654321000],
  synchronize: false, // Set to false when using migrations
  logging: true,
});
