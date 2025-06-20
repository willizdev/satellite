import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export const UserLib = {
    getByToken: async (token: string) =>
        await db.query.users.findFirst({
            where: eq(users.token, token)
        }),

    getByEmail: async (email: string) =>
        await db.query.users.findFirst({
            where: eq(users.email, email)
        }),

    create: async (name: string, email: string, password: string) => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const token = randomBytes(32).toString("hex");

        await db.insert(users).values({
            hash: hash,
            token: token,
            name: name,
            email: email
        });

        return token;
    },

    update: async (id: number, name: string, bio: string | undefined) => {
        await db.update(users).set({ name: name, bio: bio }).where(eq(users.id, id));
    },

    delete: async (id: number) => {
        await db.delete(users).where(eq(users.id, id));
    }
};
