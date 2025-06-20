import { db } from "@/db";
import { lists, activities } from "@/db/schema";
import { eq } from "drizzle-orm";

export const ListLib = {
    create: async function (userId: number, workspaceId: number, boardId: number, name: string) {
        const [list] = await db.insert(lists).values({ boardId, name }).returning();

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: list.id,
            entityName: list.name,
            entityType: "list",
            action: "create"
        });

        return list;
    },

    update: async function (userId: number, workspaceId: number, listId: number, name: string) {
        await db.update(lists).set({ name: name }).where(eq(lists.id, listId));

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: listId,
            entityName: name,
            entityType: "list",
            action: "update"
        });
    },

    delete: async function (userId: number, workspaceId: number, listId: number) {
        const [list] = await db.delete(lists).where(eq(lists.id, listId)).returning();

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: listId,
            entityName: list.name,
            entityType: "list",
            action: "delete"
        });
    },

    getById: async function (listId: number) {
        return await db
            .select({
                id: lists.id,
                name: lists.name,
                boardId: lists.boardId
            })
            .from(lists)
            .where(eq(lists.id, listId))
            .then((rows) => rows[0]);
    },

    getAll: async function (boardId: number) {
        return await db
            .select({
                id: lists.id,
                name: lists.name,
                boardId: lists.boardId
            })
            .from(lists)
            .where(eq(lists.boardId, boardId));
    }
};
