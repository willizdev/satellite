import { db } from "@/db";
import { activities, cards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const CardLib = {
    create: async (userId: number, workspaceId: number, listId: number, name: string) => {
        const [card] = await db.insert(cards).values({ listId, name }).returning();

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: card.id,
            entityName: card.name,
            entityType: "card",
            action: "create"
        });

        return card;
    },

    update: async (
        userId: number,
        workspaceId: number,
        cardId: number,
        name: string,
        description: string | undefined
    ) => {
        await db.update(cards).set({ name, description }).where(eq(cards.id, cardId));

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: cardId,
            entityName: name,
            entityType: "card",
            action: "update"
        });
    },

    delete: async (userId: number, workspaceId: number, cardId: number) => {
        const [card] = await db.delete(cards).where(eq(cards.id, cardId)).returning();

        await db.insert(activities).values({
            userId: userId,
            workspaceId: workspaceId,
            entityId: cardId,
            entityName: card.name,
            entityType: "card",
            action: "delete"
        });
    },

    getById: async (cardId: number) =>
        await db
            .select({
                id: cards.id,
                name: cards.name,
                description: cards.description,
                done: cards.done,
                listId: cards.listId
            })
            .from(cards)
            .where(eq(cards.id, cardId))
            .then((rows) => rows[0]),

    getAll: async (listId: number) =>
        await db
            .select({
                id: cards.id,
                name: cards.name,
                description: cards.description,
                done: cards.done,
                listId: cards.listId
            })
            .from(cards)
            .where(eq(cards.listId, listId))
};
