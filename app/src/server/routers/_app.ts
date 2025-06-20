import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { workspaceRouter } from "./workspace";
import { membershipRouter } from "./membership";
import { activityRouter } from "./activity";
import { boardRouter } from "./board";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    workspace: workspaceRouter,
    membership: membershipRouter,
    activity: activityRouter,
    board: boardRouter
});

export type AppRouter = typeof appRouter;
