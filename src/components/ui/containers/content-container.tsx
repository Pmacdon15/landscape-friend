
export default function ContentContainer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col rounded-sm w-full md:w-5/6 lg:w-4/6 p-4 md:p-6 bg-white/30 backdrop-filter backdrop-blur-sm shadow-lg gap-4 ">
            {children}
        </div>
    );
}
