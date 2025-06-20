import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const MembershipLib = {
    getRole: async (workspaceId: number, userId: number) => {
        const membership = await db.query.workspaceMembers.findFirst({
            where: (wm, { eq, and }) => and(eq(wm.userId, userId), eq(wm.workspaceId, workspaceId))
        });

        if (!membership) return "unknown";
        return membership.role;
    },

    add: async (workspaceId: number, userId: number) => {
        await db.insert(workspaceMembers).values({
            userId: userId,
            workspaceId: workspaceId,
            role: "member"
        });
    },

    update: async (workspaceId: number, userId: number, role: "admin" | "member") => {
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

    remove: async (workspaceId: number, userId: number) => {
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
