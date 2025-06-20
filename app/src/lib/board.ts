import { db } from "@/db";
import { boards, activities } from "@/db/schema";
import { eq } from "drizzle-orm";

export const BoardLib = {
    create: async function (
        workspaceId: number,
        name: string,
        backgroundId: number,
        userId: number
    ) {
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

    update: async function (boardId: number, name: string, backgroundId: number, userId: number) {
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

    delete: async function (boardId: number, userId: number) {
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

    getById: async function (boardId: number) {
        return await db
            .select({
                id: boards.id,
                name: boards.name,
                backgroundId: boards.backgroundId,
                workspaceId: boards.workspaceId,
                createdAt: boards.createdAt
            })
            .from(boards)
            .where(eq(boards.id, boardId))
            .then((rows) => rows[0]);
    },

    getAll: async function (workspaceId: number) {
        return await db
            .select({
                id: boards.id,
                name: boards.name,
                backgroundId: boards.backgroundId,
                workspaceId: boards.workspaceId
            })
            .from(boards)
            .where(eq(boards.workspaceId, workspaceId));
    }
};
