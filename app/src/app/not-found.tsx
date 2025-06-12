"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
    const { push } = useRouter();

    useEffect(() => {
        push("/user/signin");
    }, [push]);

    return null;
}
