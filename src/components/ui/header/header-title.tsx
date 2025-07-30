export default function HeaderTitle({text }: { text: string }) {
    return (
        <div className="flex  w-full justify-center align-middle bg-white/30 shadow-2xl border rounded-sm  p-3  text-center ">
            <h1 className=" text-2xl md:text-4xl text-center text-gray-800 whitespace-nowrap ">{text}</h1>
        </div>
    );
}