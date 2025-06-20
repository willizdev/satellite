import { MembershipLib } from "@/lib/membership";
import { WorkspaceLib } from "@/lib/workspace";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const workspaceRouter = router({
    create: publicProcedure
        .use(isAuthed)
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await WorkspaceLib.create(input.name, ctx.user.id);
        }),

    update: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.id, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner" && role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

            await WorkspaceLib.update(input.id, ctx.user.id, input.name);
        }),

    delete: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.id, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner") throw new TRPCError({ code: "FORBIDDEN" });

            await WorkspaceLib.delete(input.id);
        }),

    getById: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.id, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return await WorkspaceLib.getById(input.id);
        }),

    getAll: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
        return await WorkspaceLib.getAll(ctx.user.id);
    })
});
