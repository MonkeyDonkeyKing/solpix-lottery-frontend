import { lotteryRouter } from "@/server/api/routers/lottery";
import { createTRPCRouter } from "@/server/api/trpc";
import { fetchRouter } from "./routers/fetching";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lottery: lotteryRouter,
  fetching: fetchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
