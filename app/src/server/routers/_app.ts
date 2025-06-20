import { router } from "../trpc";
import { activityRouter } from "./activity";
import { authRouter } from "./auth";
import { boardRouter } from "./board";
import { cardRouter } from "./card";
import { listRouter } from "./list";
import { membershipRouter } from "./membership";
import { userRouter } from "./user";
import { workspaceRouter } from "./workspace";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    workspace: workspaceRouter,
    membership: membershipRouter,
    activity: activityRouter,
    board: boardRouter,
    list: listRouter,
    card: cardRouter
});

export type AppRouter = typeof appRouter;
