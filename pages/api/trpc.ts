import { initTRPC } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

export const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure.query(() => 'Hello Sayang Smash')
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({ router: appRouter, createContext: () => null })
