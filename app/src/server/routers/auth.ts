import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
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
        .mutation(async ({ input }) => {
            const existing = await db.query.users.findFirst({
                where: eq(users.email, input.email)
            });
            if (existing) throw new Error("User already exists");

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(input.password, salt);
            const token = randomBytes(32).toString("hex");

            await db.insert(users).values({
                hash: hash,
                token: token,
                name: input.name,
                email: input.email
            });

            return { token };
        }),

    login: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.email, input.email)
            });
            if (!user) throw new Error("User not found");

            const valid = await bcrypt.compare(input.password, user.hash);
            if (!valid) throw new Error("Invalid credentials");

            return { token: user.token };
        })
});
