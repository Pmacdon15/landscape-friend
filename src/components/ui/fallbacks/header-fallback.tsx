import Link from 'next/link';
import HeaderImageIco from '../header/header-image-ico';
import HeaderTitle from '../header/header-title';

export default function HeaderFallBack() {
    return (
        <>
            <div className="flex flex-col items-center bg-background border rounded-b-sm p-4 w-full gap-2 ">
                <div className='flex  w-full justify-baseline relative'>
                    <div className="flex flex-col items-center justify-center h-full">
                        <Link href='/'>
                            <HeaderImageIco />
                        </Link>
                    </div>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit'>
                        <HeaderTitle text='Landscape Friend' />
                    </div>
                </div>
                <div className='flex flex-wrap justify-between border-t w-full pt-2'>                    
                </div>
            </div>
        </>
    );
}