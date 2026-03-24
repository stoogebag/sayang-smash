import type { TRPCRouterRecord } from "@trpc/server";

import { CreateExerciseSchema, SayangSmashExercise } from "@acme/db/schema";

import { publicProcedure } from "../trpc";

export const exerciseRouter = {
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(SayangSmashExercise)
      .orderBy(SayangSmashExercise.name);
  }),

  create: publicProcedure
    .input(CreateExerciseSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(SayangSmashExercise).values(input).returning();
    }),
} satisfies TRPCRouterRecord;
