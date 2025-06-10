import Image from "next/image";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Image src="/satellite.svg" alt="satellite" width={150} height={150} />
        </div>
    );
}
