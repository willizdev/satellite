import { db } from "@/db";
import { activities, boards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const BoardLib = {
    create: async (workspaceId: number, name: string, backgroundId: number, userId: number) => {
        const [board] = await db
            .insert(boards)
            .values({
                name: name,
                workspaceId: workspaceId,
                backgroundId: backgroundId
            })
            .returning();

        await db.insert(activities).values({
            workspaceId: workspaceId,
            userId: userId,
            entityId: board.id,
            entityName: name,
            entityType: "board",
            action: "create"
        });

        return board;
    },

    update: async (boardId: number, name: string, backgroundId: number, userId: number) => {
        const [board] = await db
            .update(boards)
            .set({
                name: name,
                backgroundId: backgroundId
            })
            .where(eq(boards.id, boardId))
            .returning();

        await db.insert(activities).values({
            workspaceId: board.workspaceId,
            userId: userId,
            entityId: board.id,
            entityName: name,
            entityType: "board",
            action: "update"
        });
    },

    delete: async (boardId: number, userId: number) => {
        const [board] = await db.delete(boards).where(eq(boards.id, boardId)).returning();

        await db.insert(activities).values({
            workspaceId: board.workspaceId,
            userId: userId,
            entityId: board.id,
            entityName: board.name,
            entityType: "board",
            action: "delete"
        });
    },

    getById: async (boardId: number) =>
        await db
            .select({
                id: boards.id,
                name: boards.name,
                backgroundId: boards.backgroundId,
                workspaceId: boards.workspaceId,
                createdAt: boards.createdAt
            })
            .from(boards)
            .where(eq(boards.id, boardId))
            .then((rows) => rows[0]),

    getAll: async (workspaceId: number) =>
        await db
            .select({
                id: boards.id,
                name: boards.name,
                backgroundId: boards.backgroundId,
                workspaceId: boards.workspaceId
            })
            .from(boards)
            .where(eq(boards.workspaceId, workspaceId))
};
