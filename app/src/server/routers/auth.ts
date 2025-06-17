import bcrypt from "bcrypt";
import { z } from "zod";
import { AuthLib } from "@/lib/auth";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
    signup: publicProcedure
        .input(
            z.object({
                name: z
                    .string()
                    .min(3)
                    .max(32)
                    .regex(/^[a-zA-Z\s]+$/),
                email: z.string().email(),
                password: z.string().min(8).max(64)
            })
        )
        .mutation(async ({ input, ctx }) => {
            if (process.env.ALLOW_SIGNUP !== "true") {
                throw new Error("Signup is not allowed");
            }

            const user = await AuthLib.userByEmail(input.email);
            if (!user) {
                throw new Error("User already exists");
            }

            const token = await AuthLib.userCreate(input.name, input.email, input.password);

            ctx.cookieStore.set("token", token, {
                httpOnly: true,
                maxAge: 3600 * 24
            });
        }),

    signin: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await AuthLib.userByEmail(input.email);
            if (!user) {
                throw new Error("Invalid credentials");
            }

            const valid = await bcrypt.compare(input.password, user.hash);
            if (!valid) {
                throw new Error("Invalid credentials");
            }

            ctx.cookieStore.set("token", user.token, {
                httpOnly: true,
                maxAge: 3600 * 24
            });
        }),

    signout: publicProcedure.mutation(async ({ ctx }) => {
        ctx.cookieStore.delete("token");
    })
});
