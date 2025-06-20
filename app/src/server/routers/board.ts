import z from "zod";
import { TRPCError } from "@trpc/server";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";
import { BoardLib } from "@/lib/board";
import { MembershipLib } from "@/lib/membership";

export const boardRouter = router({
    create: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                name: z.string().min(1),
                backgroundId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner" && role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

            BoardLib.create(input.workspaceId, input.name, input.backgroundId, ctx.user.id);
        }),

    edit: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                id: z.number(),
                name: z.string().min(1),
                backgroundId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const board = await BoardLib.getById(input.id);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner" && role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

            BoardLib.update(input.id, input.name, input.backgroundId, ctx.user.id);
        }),

    delete: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const board = await BoardLib.getById(input.id);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);

            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });
            if (role !== "owner" && role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

            BoardLib.delete(input.id, ctx.user.id);
        }),

    getById: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const board = await BoardLib.getById(input.id);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return board;
        }),

    getAll: publicProcedure
        .use(isAuthed)
        .input(z.object({ workspaceId: z.number() }))
        .query(async ({ ctx, input }) => {
            const role = await MembershipLib.getRole(input.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            const boards = await BoardLib.getAll(input.workspaceId);
            if (!boards) throw new TRPCError({ code: "NOT_FOUND" });

            return boards;
        })
});
