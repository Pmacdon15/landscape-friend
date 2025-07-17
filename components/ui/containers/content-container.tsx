
export default function ContentContainer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="rounded-sm w-4/6 p-8 bg-background/70 shadow-lg">
            {children}
        </div>
    );
}
