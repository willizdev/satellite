import z from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    hello: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => `Hello, ${input.name}!`)
});

export type AppRouter = typeof appRouter;
