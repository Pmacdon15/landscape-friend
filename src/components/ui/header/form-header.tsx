export default function FormHeader({text }: { text: string }) {
    return (
        <div className="flex justify-center align-middle p-2 bg-white/30 shadow-2xl border rounded-sm">
            <h1 className="text-2xl font-semibold text-gray-800">{text}</h1>
        </div>
    );
}