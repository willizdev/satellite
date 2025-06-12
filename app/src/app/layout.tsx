import { ToastProvider } from "@/components/toastProvider";
import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { TRPCProvider } from "../components/trpcProvider";
import "@/styles/globals.css";
import "@/styles/animations.css";

const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Satellite",
    description:
        "Satellite helps you launch your projects and ideas into orbit, organizing them visually with constellations and detailed missions."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${fredoka.variable} antialiased`}>
                <TRPCProvider>
                    <ToastProvider>{children}</ToastProvider>
                </TRPCProvider>
            </body>
        </html>
    );
}
