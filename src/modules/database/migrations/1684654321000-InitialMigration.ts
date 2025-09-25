import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1684654321000 implements MigrationInterface {
  name = "InitialMigration1684654321000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "chains" (
                "id" uuid NOT NULL,
                "defi_id" numeric NOT NULL,
                "name" character varying NOT NULL,
                "is_enabled" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_chains" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "address" bytea NOT NULL,
                "symbol" character varying,
                "name" character varying,
                "decimals" smallint NOT NULL DEFAULT '0',
                "is_native" boolean NOT NULL DEFAULT false,
                "chain_id" uuid NOT NULL,
                "is_protected" boolean NOT NULL DEFAULT false,
                "last_update_author" character varying,
                "priority" integer NOT NULL DEFAULT '0',
                "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "logo_id" uuid NOT NULL,
                "logo_token_id" uuid,
                "logo_big_relative_path" character varying NOT NULL,
                "logo_small_relative_path" character varying NOT NULL,
                "logo_thumb_relative_path" character varying NOT NULL,
                "price" numeric(28,0) NOT NULL DEFAULT '0',
                "last_price_update" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_tokens" PRIMARY KEY ("id")
            )
        `);

    // Create extension for UUID generation if it doesn't exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
