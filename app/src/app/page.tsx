"use client";

import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image src="/satellite.svg" alt="satellite" width={150} height={150} />
        </div>
    );
}
