import { router } from "../trpc";
import { authRouter } from "./auth";
import { membershipRouter } from "./membership";
import { userRouter } from "./user";
import { workspaceRouter } from "./workspace";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    workspace: workspaceRouter,
    membership: membershipRouter
});

export type AppRouter = typeof appRouter;
