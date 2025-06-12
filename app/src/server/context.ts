import { cookies } from "next/headers";

export async function createContext(p0: { req: Request }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? null;

    return { cookieStore, token };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
