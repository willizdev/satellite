import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { TRPCProvider } from "../components/trpc-provider";
import "@/styles/globals.css";

const openSans = Open_Sans({
    variable: "--font-open-sans",
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
            <body className={`${openSans.variable} antialiased`}>
                <TRPCProvider>{children}</TRPCProvider>
            </body>
        </html>
    );
}
