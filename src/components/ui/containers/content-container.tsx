export default function ContentContainer({
  children,
}: {
  children: React.ReactNode; 
}) { 
  return <div className={"flex flex-col rounded-sm  max-sm:w-full sm:w-3/6 md:w-4/6 p-6 bg-white/50 shadow-lg gap-4"}>{children}</div>;
}