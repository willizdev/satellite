import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { workspaceRouter } from "./workspace";
import { membershipRouter } from "./membership";
import { activityRouter } from "./activity";
import { boardRouter } from "./board";
import { listRouter } from "./list";
import { cardRouter } from "./card";

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
