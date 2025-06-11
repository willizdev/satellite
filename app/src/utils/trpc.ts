import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
    return trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
                headers: async () => getAuthHeaders()
            })
        ]
    });
}

function getAuthHeaders() {
    if (typeof window !== "undefined") {
        const token = `Bearer ${localStorage.getItem("token") ?? ""}`;
        return { authorization: token };
    }

    return {};
}

function getBaseUrl() {
    if (typeof window !== "undefined") return "";

    if (process.env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    }

    return `http://localhost:${process.env.PORT ?? 3000}`;
}
