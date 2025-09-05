import HeaderTitle from "./header-title";
import Image from "next/image";
export default function SheetLogoHeader() {
    return (
        <div className="flex flex-col justify-center items-center md:p-4 w-full">
            <Image src="/logo.png" alt="Lawn Buddy Logo" width={100} height={100} />
            <HeaderTitle text='Landscape Friend' />
        </div>
    );
}