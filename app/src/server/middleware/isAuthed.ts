import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { AuthLib } from "@/lib/auth";

export const isAuthed = middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await AuthLib.userByToken(ctx.token);

    if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { user } });
});
