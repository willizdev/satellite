import z from "zod";
import { TRPCError } from "@trpc/server";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";
import { ActivityLib } from "@/lib/activity";
import { MembershipLib } from "@/lib/membership";

export const activityRouter = router({
    allActivities: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return await ActivityLib.getAll(input.workspaceId);
        }),

    cardActivities: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                cardId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return await ActivityLib.getCardActivities(input.workspaceId, input.cardId);
        })
});
