export default function ListViewWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col  min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 mt-2 ">
            {children}
        </div>
    );
}