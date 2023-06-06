import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "./routers/category";
import { complainerRouter } from "./routers/complainer";
import { complaintRouter } from "./routers/complaint";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  category: categoryRouter,
  complainer: complainerRouter,
  complaint: complaintRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
