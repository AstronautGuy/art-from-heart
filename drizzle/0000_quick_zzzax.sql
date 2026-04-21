CREATE TABLE "art-from-heart_category" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "art-from-heart_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "art-from-heart_product" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"category_id" varchar(128),
	"name" varchar(256) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stock_type" varchar(50) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"free_shipping_eligible" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "art-from-heart_store_setting" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"config" jsonb NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "art-from-heart_category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_category_idx" ON "art-from-heart_product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_active_idx" ON "art-from-heart_product" USING btree ("is_active");