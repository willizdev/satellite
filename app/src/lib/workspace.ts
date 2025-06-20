import { db } from "@/db";
import { activities, workspaceMembers, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";

export const WorkspaceLib = {
    create: async (name: string, userId: number) => {
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

    update: async (id: number, userId: number, name: string) => {
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

    delete: async (id: number) => {
        await db.delete(workspaces).where(eq(workspaces.id, id));
    },

    getById: async (id: number) =>
        await db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                updatedAt: workspaces.updatedAt,
                role: workspaceMembers.role
            })
            .from(workspaces)
            .where(eq(workspaces.id, id))
            .then((rows) => rows[0]),

    getAll: async (userId: number) =>
        await db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                updatedAt: workspaces.updatedAt,
                role: workspaceMembers.role
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
            .where(eq(workspaceMembers.userId, userId))
};
