export function InputDiv({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-2 flex gap-2 items-center">
            {children}
        </div>
    )
}