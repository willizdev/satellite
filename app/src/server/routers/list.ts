import { BoardLib } from "@/lib/board";
import { ListLib } from "@/lib/list";
import { MembershipLib } from "@/lib/membership";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const listRouter = router({
    create: publicProcedure
        .use(isAuthed)
        .input(z.object({ boardId: z.number(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const board = await BoardLib.getById(input.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await ListLib.create(ctx.user.id, board.workspaceId, input.boardId, input.name);
        }),

    update: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const list = await ListLib.getById(input.id);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await ListLib.update(ctx.user.id, board.workspaceId, input.id, input.name);
        }),

    delete: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const list = await ListLib.getById(input.id);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await ListLib.delete(ctx.user.id, board.workspaceId, input.id);
        }),

    getById: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const list = await ListLib.getById(input.id);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return list;
        }),

    getAll: publicProcedure
        .use(isAuthed)
        .input(z.object({ boardId: z.number() }))
        .query(async ({ ctx, input }) => {
            const lists = await ListLib.getAll(input.boardId);
            if (!lists) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(input.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return lists;
        })
});
