CREATE TABLE "sayang_smash_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(5) NOT NULL,
	"exercises" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sayang_smash_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sayang_smash_exercises" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"use_weight" boolean DEFAULT false NOT NULL,
	"type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
