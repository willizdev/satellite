"use client";

import { trpc } from "@/utils/trpc";
import Image from "next/image";

export default function Home() {
    const { data, isLoading } = trpc.hello.useQuery({ name: "Satellite" });
    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image src="/satellite.svg" alt="satellite" width={150} height={150} />
            <h1 className="mt-5 text-[2em]">{data}</h1>
        </div>
    );
}
