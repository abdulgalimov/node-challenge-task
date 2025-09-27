CREATE TABLE "tokens" (
	"id" varchar PRIMARY KEY NOT NULL,
	"address" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"name" varchar NOT NULL,
	"decimals" smallint NOT NULL,
	"is_native" boolean DEFAULT false NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"price_id" varchar,
	"price_update_required" boolean DEFAULT true NOT NULL,
	"chain_id" varchar NOT NULL,
	"logo_id" varchar NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "logos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"big_relative_path" varchar NOT NULL,
	"small_relative_path" varchar NOT NULL,
	"thumb_relative_path" varchar NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chains" (
	"id" varchar PRIMARY KEY NOT NULL,
	"deid" serial NOT NULL,
	"name" varchar NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "chains_deid_unique" UNIQUE("deid")
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"id" varchar PRIMARY KEY NOT NULL,
	"last_update_author" varchar NOT NULL,
	"last_price" bigint NOT NULL,
	"token_id" varchar NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_chain_id_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "public"."chains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "address" ON "tokens" USING btree ("address");--> statement-breakpoint
CREATE INDEX "price_update_required" ON "tokens" USING btree ("price_update_required");--> statement-breakpoint
CREATE UNIQUE INDEX "all_path" ON "logos" USING btree ("big_relative_path","small_relative_path","thumb_relative_path");--> statement-breakpoint
CREATE UNIQUE INDEX "name" ON "chains" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "token_id" ON "prices" USING btree ("token_id");