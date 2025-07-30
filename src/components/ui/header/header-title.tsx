export default function HeaderTitle({text }: { text: string }) {
    return (
        <div className="flex justify-center align-middle bg-white/30 shadow-2xl border rounded-sm text-2xl md:text-4xl p-2 md:p-6">
            <h1 className="text-4xl  text-gray-800">{text}</h1>
        </div>
    );
}