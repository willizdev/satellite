import { eq } from "drizzle-orm";
import { db } from "@/db";
import { workspaces, workspaceMembers, activities } from "@/db/schema";

export const WorkspaceLib = {
    create: async function (name: string, userId: number) {
        const now = new Date();

        const [workspace] = await db.insert(workspaces).values({ name }).returning();

        await db.insert(workspaceMembers).values({
            userId: userId,
            workspaceId: workspace.id,
            role: "owner"
        });

        await db.insert(activities).values({
            workspaceId: workspace.id,
            userId: userId,
            entityId: workspace.id,
            entityName: name,
            entityType: "workspace",
            action: "create",
            time: now
        });

        return workspace;
    },

    update: async function (id: number, userId: number, name: string) {
        const now = new Date();

        await db.update(workspaces).set({ name, updatedAt: now }).where(eq(workspaces.id, id));

        await db.insert(activities).values({
            workspaceId: id,
            userId: userId,
            entityId: id,
            entityName: name,
            entityType: "workspace",
            action: "update",
            time: now
        });
    },

    delete: async function (id: number, userId: number) {
        const now = new Date();

        const workspace = await db
            .select({ name: workspaces.name })
            .from(workspaces)
            .where(eq(workspaces.id, id))
            .then((rows) => rows[0]);

        await db.delete(workspaces).where(eq(workspaces.id, id));

        await db.insert(activities).values({
            workspaceId: id,
            userId: userId,
            entityId: id,
            entityName: workspace.name,
            entityType: "workspace",
            action: "delete",
            time: now
        });
    },

    getById: async function (id: number) {
        return await db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                updatedAt: workspaces.updatedAt,
                role: workspaceMembers.role
            })
            .from(workspaces)
            .where(eq(workspaces.id, id))
            .then((rows) => rows[0]);
    },

    getAll: async function (userId: number) {
        return await db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                updatedAt: workspaces.updatedAt,
                role: workspaceMembers.role
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
            .where(eq(workspaceMembers.userId, userId));
    },

    getRole: async function (id: number, userId: number) {
        const membership = await db.query.workspaceMembers.findFirst({
            where: (wm, { eq, and }) => and(eq(wm.userId, userId), eq(wm.workspaceId, id))
        });

        if (!membership) return "unknown";
        return membership.role;
    }
};
