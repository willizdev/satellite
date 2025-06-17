import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";

export const AuthLib = {
    userByToken: async function (token: string) {
        return await db.query.users.findFirst({
            where: eq(users.token, token)
        });
    },

    userByEmail: async function (email: string) {
        return await db.query.users.findFirst({
            where: eq(users.email, email)
        });
    },

    userCreate: async function (name: string, email: string, password: string): Promise<string> {
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
    }
};
