import type { TRPCRouterRecord } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { CreateWorkoutSchema, SayangSmashEntry } from "@acme/db/schema";

import { publicProcedure } from "../trpc";
import { generateSlug } from "../utils/slug";

export const workoutRouter = {
  create: publicProcedure
    .input(CreateWorkoutSchema)
    .mutation(async ({ ctx, input }) => {
      // Generate a unique slug, retry if collision
      let slug: string;
      let attempts = 0;
      do {
        slug = generateSlug();
        const existing = await ctx.db
          .select({ id: SayangSmashEntry.id })
          .from(SayangSmashEntry)
          .where(eq(SayangSmashEntry.slug, slug))
          .limit(1);
        if (existing.length === 0) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        throw new Error("Failed to generate unique slug");
      }

      const [entry] = await ctx.db
        .insert(SayangSmashEntry)
        .values({ ...input, slug })
        .returning();

      return entry!;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().length(5) }))
    .query(async ({ ctx, input }) => {
      const [entry] = await ctx.db
        .select()
        .from(SayangSmashEntry)
        .where(eq(SayangSmashEntry.slug, input.slug))
        .limit(1);

      return entry ?? null;
    }),

  getRandom: publicProcedure.query(async ({ ctx }) => {
    const [entry] = await ctx.db
      .select()
      .from(SayangSmashEntry)
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return entry ?? null;
  }),
} satisfies TRPCRouterRecord;
