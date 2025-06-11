import { db } from "@/db";
import { users } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { middleware } from "../trpc";

export const isAuthed = middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.token) throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await db.query.users.findFirst({
        where: eq(users.token, ctx.token)
    });

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({ ctx: { user } });
});
