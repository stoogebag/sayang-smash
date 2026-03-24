import { authRouter } from "./router/auth";
import { exerciseRouter } from "./router/exercise";
import { workoutRouter } from "./router/workout";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  exercise: exerciseRouter,
  workout: workoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
