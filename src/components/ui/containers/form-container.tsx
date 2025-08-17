export default function FormContainer({
    children,
    popover = false,
}: {
    children: React.ReactNode;
    popover?: boolean;
}) {
    return (
        <div className={`bg-white  shadow-2xl rounded-sm border  ${popover ? 'p-2' : 'p-1'} ${popover ? 'w-full' : 'max-sm:w-full sm:w-4/6 md:w-5/6'}  `}>
            <div className={`bg-background ${popover ? 'p-2' : 'p-1'} shadow-2xl rounded-sm border `}>
                <div className="flex flex-col rounded-sm w-full p-2 bg-[url('/lawn3.jpg')] bg-cover bg-center bg-no-repeat shadow-2xl gap-2 border">
                    {children}
                </div>
            </div>
        </div>
    );
}