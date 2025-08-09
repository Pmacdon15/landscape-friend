export default function ContentContainer({
  children,
}: {
  children: React.ReactNode; 
}) { 
  return <div className={"flex flex-col rounded-sm w-full p-6 bg-white/70 shadow-lg gap-4"}>{children}</div>;
}