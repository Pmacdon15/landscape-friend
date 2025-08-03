export default function ContentContainer({
  children,
}: {
  children: React.ReactNode; 
}) { 
  return <div className={"flex flex-col rounded-sm w-full  md:p-6 bg-white/50 shadow-lg gap-4"}>{children}</div>;
}