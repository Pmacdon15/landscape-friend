import Image  from "next/image";
export default function HeaderImageIco() {
    return (
        <div className='flex items-center'>
            <div
                style={{
                    backgroundImage: 'url(/lawn3.jpg)',
                    backgroundPosition: '0% 20%', // Show the bottom half of the image
                }}
                className="p-2 border rounded-sm bg-background w-[50px] md:w-[75px]"
            >
                <Image src='/logo.png' height={100} width={100} alt={"logo"} />
            </div>
        </div>
    );
}