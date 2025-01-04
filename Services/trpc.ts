import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const appRouter = t.router({
  addJob: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        verifyCode: z.string(),
        expiryDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      // Add your job logic here
      return { jobId: "dummy-id", status: "Job added to the queue" };
    }),
});

// Export the router type for client use
export type AppRouter = typeof appRouter;
