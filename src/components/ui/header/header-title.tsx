export default function HeaderTitle({ text }: { text: string }) {
  return (
    <div className="flex w-full justify-center align-middle bg-white/30 shadow-xl border rounded-sm p-2 text-center">
      <h1 className="text-lg md:text-4xl text-center text-gray-800 break-words overflow-hidden">
        {text}
      </h1>
    </div>
  );
}