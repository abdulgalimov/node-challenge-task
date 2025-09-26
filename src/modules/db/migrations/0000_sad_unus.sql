CREATE TABLE "tokens" (
	"id" varchar PRIMARY KEY NOT NULL,
	"address" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"name" varchar NOT NULL,
	"decimals" smallint NOT NULL,
	"isNative" boolean DEFAULT false NOT NULL,
	"isProtected" boolean DEFAULT false NOT NULL,
	"lastUpdateAuthor" varchar,
	"priority" integer DEFAULT 0 NOT NULL,
	"lastPriceUpdate" date,
	"price" bigint NOT NULL,
	"chainId" varchar NOT NULL,
	"logoId" varchar NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "logos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"bigRelativePath" varchar NOT NULL,
	"smallRelativePath" varchar NOT NULL,
	"thumbRelativePath" varchar NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "chains" (
	"id" varchar PRIMARY KEY NOT NULL,
	"deId" serial NOT NULL,
	"name" varchar NOT NULL,
	"isEnabled" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "chains_deId_unique" UNIQUE("deId")
);
--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_chainId_chains_id_fk" FOREIGN KEY ("chainId") REFERENCES "public"."chains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_logoId_logos_id_fk" FOREIGN KEY ("logoId") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "address" ON "tokens" USING btree ("address");--> statement-breakpoint
CREATE UNIQUE INDEX "all_path" ON "logos" USING btree ("bigRelativePath","smallRelativePath","thumbRelativePath");--> statement-breakpoint
CREATE UNIQUE INDEX "name" ON "chains" USING btree ("name");