export default function PageContainer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="font-sans flex flex-col  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            {children}
        </div>
    );
}