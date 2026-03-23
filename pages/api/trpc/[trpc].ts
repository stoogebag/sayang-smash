import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '../../../src/trpc'
export default createNextApiHandler({ router: appRouter, createContext: () => null })
