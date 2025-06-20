import { workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";

export const MembershipLib = {
    getRole: async function (workspaceId: number, userId: number) {
        const membership = await db.query.workspaceMembers.findFirst({
            where: (wm, { eq, and }) => and(eq(wm.userId, userId), eq(wm.workspaceId, workspaceId))
        });

        if (!membership) return "unknown";
        return membership.role;
    },

    add: async function (workspaceId: number, userId: number) {
        await db.insert(workspaceMembers).values({
            userId: userId,
            workspaceId: workspaceId,
            role: "member"
        });
    },

    update: async function (workspaceId: number, userId: number, role: "admin" | "member") {
        await db
            .update(workspaceMembers)
            .set({ role: role })
            .where(
                and(
                    eq(workspaceMembers.userId, userId),
                    eq(workspaceMembers.workspaceId, workspaceId)
                )
            );
    },

    remove: async function (workspaceId: number, userId: number) {
        await db
            .delete(workspaceMembers)
            .where(
                and(
                    eq(workspaceMembers.userId, userId),
                    eq(workspaceMembers.workspaceId, workspaceId)
                )
            );
    }
};
