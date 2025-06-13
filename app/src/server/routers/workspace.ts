import { db } from "@/db";
import { activities, workspaceMembers, workspaces } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { isAuthed } from "../middleware/isAuthed";
import { publicProcedure, router } from "../trpc";

export const workspaceRouter = router({
    info: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const workspaceUser = await db
                .select({
                    id: workspaces.id,
                    name: workspaces.name,
                    updatedAt: workspaces.updatedAt,
                    role: workspaceMembers.role
                })
                .from(workspaceMembers)
                .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
                .where(and(eq(workspaceMembers.userId, ctx.user.id), eq(workspaces.id, input.id)))
                .then((rows) => rows[0]);

            if (!workspaceUser) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return workspaceUser;
        }),

    infoAll: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
        const user = ctx.user;

        const workspaceUsers = await db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                updatedAt: workspaces.updatedAt,
                role: workspaceMembers.role
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
            .where(eq(workspaceMembers.userId, user.id));

        return workspaceUsers;
    }),

    create: publicProcedure
        .use(isAuthed)
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const [workspace] = await db
                .insert(workspaces)
                .values({ name: input.name })
                .returning();

            await db.insert(workspaceMembers).values({
                userId: ctx.user.id,
                workspaceId: workspace.id,
                role: "owner"
            });

            return workspace;
        }),

    edit: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const workspaceUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, ctx.user.id), eq(m.workspaceId, input.id))
            });

            if (!workspaceUser) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (workspaceUser.role !== "owner" && workspaceUser.role !== "admin") {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const now = new Date();

            await db
                .update(workspaces)
                .set({ name: input.name, updatedAt: now })
                .where(eq(workspaces.id, input.id));

            await db.insert(activities).values({
                userId: ctx.user.id,
                workspaceId: input.id,
                entityName: input.name,
                entityType: "workspace",
                action: "update",
                time: now
            });
        }),

    delete: publicProcedure
        .use(isAuthed)
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const workspaceUser = await db.query.workspaceMembers.findFirst({
                where: (m, { eq, and }) =>
                    and(eq(m.userId, ctx.user.id), eq(m.workspaceId, input.id))
            });

            if (!workspaceUser) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (workspaceUser.role !== "owner") {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db.delete(workspaces).where(eq(workspaces.id, input.id));
        })
});
