import { initTRPC } from '@trpc/server'

export const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure.query(() => 'hello Sayang Smash')
})

export type AppRouter = typeof appRouter
