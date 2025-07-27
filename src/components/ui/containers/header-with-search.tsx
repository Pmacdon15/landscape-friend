export default function HeaderWithSearch({
    children,
}: { children: React.ReactNode; }
) {
    return (
        <div className="flex flex-col md:flex-row justify-between">
            {children}
        </div>
    );
}