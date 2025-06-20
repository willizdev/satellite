import { UserLib } from "@/lib/user";
import z from "zod";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
    getAuthed: publicProcedure.use(isAuthed).query(({ ctx }) => {
        return {
            name: ctx.user.name,
            bio: ctx.user.bio,
            email: ctx.user.email,
            createdAt: ctx.user.createdAt
        };
    }),

    update: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                name: z
                    .string()
                    .min(3)
                    .max(32)
                    .regex(/^[a-zA-Z\s]+$/),
                bio: z.string().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await UserLib.update(ctx.user.id, input.name, input.bio);
        }),

    delete: publicProcedure.use(isAuthed).mutation(async ({ ctx }) => {
        await UserLib.delete(ctx.user.id);
    })
});
