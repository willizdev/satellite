import { UserLib } from "@/lib/user";
import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

export const isAuthed = middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await UserLib.getByToken(ctx.token);

    if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { user } });
});
