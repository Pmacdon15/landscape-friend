export default function HeaderWithSearch({
    children,
}: { children: React.ReactNode; }
) {
    return (
        <div className="flex flex-col gap-2 lg:flex-row justify-between ">
            {children}
        </div>
    );
}