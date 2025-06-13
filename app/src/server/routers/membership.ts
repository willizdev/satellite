import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
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
            const workspaceUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, ctx.user.id), eq(m.workspaceId, input.workspaceId))
            });

            if (!workspaceUser) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            if (workspaceUser.role !== "owner" && workspaceUser.role !== "admin") {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const existing = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, input.userId), eq(m.workspaceId, input.workspaceId))
            });

            if (existing) {
                throw new TRPCError({ code: "CONFLICT" });
            }

            await db.insert(workspaceMembers).values({
                userId: input.userId,
                workspaceId: input.workspaceId,
                role: "member"
            });
        }),

    update: publicProcedure
        .use(isAuthed)
        .input(
            z.object({
                workspaceId: z.number(),
                userId: z.number(),
                role: z.enum(["owner", "admin", "member"])
            })
        )
        .mutation(async ({ ctx, input }) => {
            const workspaceUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, ctx.user.id), eq(m.workspaceId, input.workspaceId))
            });

            if (!workspaceUser) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            if (workspaceUser.role !== "owner") {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            if (ctx.user.id === input.userId) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            await db
                .update(workspaceMembers)
                .set({ role: input.role })
                .where(
                    and(
                        eq(workspaceMembers.userId, input.userId),
                        eq(workspaceMembers.workspaceId, input.workspaceId)
                    )
                );
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
            const workspaceUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, ctx.user.id), eq(m.workspaceId, input.workspaceId))
            });

            if (!workspaceUser) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const targetUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, input.userId), eq(m.workspaceId, input.workspaceId))
            });

            if (!targetUser) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (workspaceUser.role === "owner") {
                if (input.userId === ctx.user.id) {
                    throw new TRPCError({ code: "BAD_REQUEST" });
                }
            } else if (workspaceUser.role === "admin") {
                if (targetUser.role !== "member") {
                    throw new TRPCError({ code: "FORBIDDEN" });
                }
            } else {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db
                .delete(workspaceMembers)
                .where(
                    and(
                        eq(workspaceMembers.userId, input.userId),
                        eq(workspaceMembers.workspaceId, input.workspaceId)
                    )
                );
        })
});
