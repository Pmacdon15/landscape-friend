export default function ContentContainer({
  children,
  popover,
}: {
  children: React.ReactNode;
  popover?: boolean;
}) {
  const className = popover
    ? "flex flex-col rounded-sm w-full p-4 md:p-6 bg-background/98 shadow-lg gap-2"
    : "flex flex-col rounded-sm w-full md:w-5/6 lg:w-4/6 p-4 md:p-6 bg-white/30 backdrop-filter backdrop-blur-sm shadow-lg gap-4";

  return <div className={className}>{children}</div>;
}