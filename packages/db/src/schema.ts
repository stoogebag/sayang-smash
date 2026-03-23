import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ----
// Sayang Smash - Workout App Tables
// ----

export const SayangSmashExercise = pgTable("sayang_smash_exercises", (t) => ({
  uid: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  useWeight: t.boolean().notNull().default(false),
  type: t.varchar({ length: 10 }).notNull().$type<"REPS" | "TIME">(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const SayangSmashEntry = pgTable("sayang_smash_entries", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  slug: t.varchar({ length: 5 }).notNull().unique(),
  exercises: t.jsonb().notNull().$type<
    Array<{
      exercise_uid: string;
      exercise_name: string;
      exercise_type: "REPS" | "TIME";
      reps?: number;
      time?: number;
      weight?: number;
    }>
  >(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateExerciseSchema = createInsertSchema(SayangSmashExercise, {
  name: z.string().min(1).max(256),
  useWeight: z.boolean(),
  type: z.enum(["REPS", "TIME"]),
}).omit({
  uid: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateWorkoutSchema = createInsertSchema(SayangSmashEntry, {
  name: z.string().min(1).max(256),
  exercises: z.array(
    z.object({
      exercise_uid: z.string(),
      exercise_name: z.string(),
      exercise_type: z.enum(["REPS", "TIME"]),
      reps: z.number().optional(),
      time: z.number().optional(),
      weight: z.number().optional(),
    }),
  ),
}).omit({
  id: true,
  slug: true,
  createdAt: true,
});
