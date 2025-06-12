"use client";

import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signout() {
    const { push } = useRouter();
    const { mutateAsync: signout } = trpc.auth.signout.useMutation();

    useEffect(() => {
        signout().then(() => {
            push("/user/signin");
        });
    }, [signout, push]);

    return null;
}
