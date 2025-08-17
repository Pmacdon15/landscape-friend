export default function ListViewWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
            {children}
        </div>
    );
}