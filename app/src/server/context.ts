export async function createContext({ req }: { req: Request }) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") ?? null;

    return { token };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
