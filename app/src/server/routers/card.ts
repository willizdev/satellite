import z from "zod";
import { TRPCError } from "@trpc/server";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";
import { CardLib } from "@/lib/card";
import { MembershipLib } from "@/lib/membership";
import { BoardLib } from "@/lib/board";
import { ListLib } from "@/lib/list";

export const cardRouter = router({
    create: publicProcedure
        .use(isAuthed)
        .input(z.object({ listId: z.number(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const list = await ListLib.getById(input.listId);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await CardLib.create(ctx.user.id, board.workspaceId, input.listId, input.name);
        }),

    update: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number(), name: z.string(), description: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            const card = await CardLib.getById(input.id);
            if (!card) throw new TRPCError({ code: "NOT_FOUND" });

            const list = await ListLib.getById(card.listId);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await CardLib.update(
                ctx.user.id,
                board.workspaceId,
                input.id,
                input.name,
                input.description
            );
        }),

    delete: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const card = await CardLib.getById(input.id);
            if (!card) throw new TRPCError({ code: "NOT_FOUND" });

            const list = await ListLib.getById(card.listId);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            await CardLib.delete(ctx.user.id, board.workspaceId, input.id);
        }),

    getById: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const card = await CardLib.getById(input.id);
            if (!card) throw new TRPCError({ code: "NOT_FOUND" });

            const list = await ListLib.getById(card.listId);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.boardId);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return card;
        }),

    getAll: publicProcedure
        .use(isAuthed)
        .input(z.object({ listId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const cards = await ListLib.getAll(input.listId);
            if (!cards) throw new TRPCError({ code: "NOT_FOUND" });

            const list = await ListLib.getById(input.listId);
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });

            const board = await BoardLib.getById(list.id);
            if (!board) throw new TRPCError({ code: "NOT_FOUND" });

            const role = await MembershipLib.getRole(board.workspaceId, ctx.user.id);
            if (role === "unknown") throw new TRPCError({ code: "NOT_FOUND" });

            return cards;
        })
});
