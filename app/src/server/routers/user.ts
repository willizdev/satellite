import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
    info: publicProcedure.use(isAuthed).query(({ ctx }) => {
        const user = ctx.user;
        return {
            name: user.name,
            bio: user.bio,
            email: user.email,
            createdAt: user.createdAt
        };
    })
});
