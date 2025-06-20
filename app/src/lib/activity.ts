import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const ActivityLib = {
    getAll: async function (workspaceId: number) {
        return await db
            .select({
                id: activities.id,
                time: activities.time,
                workspaceId: activities.workspaceId,
                userName: users.name,
                entityId: activities.entityId,
                entityName: activities.entityName,
                entityType: activities.entityType,
                action: activities.action
            })
            .from(activities)
            .innerJoin(users, eq(activities.userId, users.id))
            .where(eq(activities.workspaceId, workspaceId))
            .orderBy(activities.time);
    },

    getCardActivities: async function (workspaceId: number, cardId: number) {
        return await db
            .select({
                id: activities.id,
                time: activities.time,
                workspaceId: activities.workspaceId,
                userName: users.name,
                entityId: activities.entityId,
                entityName: activities.entityName,
                entityType: activities.entityType,
                action: activities.action
            })
            .from(activities)
            .innerJoin(users, eq(activities.userId, users.id))
            .where(
                and(
                    eq(activities.workspaceId, workspaceId),
                    eq(activities.entityId, cardId),
                    eq(activities.entityType, "card")
                )
            )
            .orderBy(activities.time);
    }
};
