import Link from "next/link";
import HeaderImageIco from "./header-image-ico";
import HeaderTitle from "./header-title";

export default function HeaderHeader() {
    return (
        <div className='flex  w-full justify-baseline relative'>
            <div className="flex flex-col items-center justify-center h-full">
                <Link href='/'>
                    <HeaderImageIco />
                </Link>
            </div>
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit'>
                <Link href='/'>
                    <HeaderTitle text='Landscape Friend' />
                </Link>
            </div>
        </div>
    );
}