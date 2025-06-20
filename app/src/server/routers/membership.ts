import { MembershipLib } from "@/lib/membership";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const membershipRouter = router({
    add: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                userId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner" && role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

            const existing = await MembershipLib.getRole(input.workspaceId, input.userId);
            if (existing !== "unknown") throw new TRPCError({ code: "CONFLICT" });

            await MembershipLib.add(input.workspaceId, input.userId);
        }),

    update: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                userId: z.number(),
                role: z.enum(["admin", "member"])
            })
        )
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner") throw new TRPCError({ code: "FORBIDDEN" });
            if (ctx.user.id === input.userId) throw new TRPCError({ code: "BAD_REQUEST" });

            const existing = await MembershipLib.getRole(input.workspaceId, input.userId);
            if (existing === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await MembershipLib.update(input.workspaceId, input.userId, input.role);
        }),

    remove: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                userId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner") throw new TRPCError({ code: "FORBIDDEN" });
            if (ctx.user.id === input.userId) throw new TRPCError({ code: "BAD_REQUEST" });

            const existing = await MembershipLib.getRole(input.workspaceId, input.userId);
            if (existing === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await MembershipLib.remove(input.workspaceId, input.userId);
        })
});
