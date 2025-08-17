'use client'
import { useUploadImage } from "@/mutations/mutations";

export default function UploadImageButton({ clientId, setView }: { clientId: number, setView: React.Dispatch<React.SetStateAction<string>> }) {
    const { mutate, isPending } = useUploadImage({
        onSuccess: () => {
            setView("list")
        },
        onError: (error) => {
            console.error("Upload failed:", error);
        }
    });
    return (
        <button
            formAction={(formData: FormData) => { mutate({ clientId: clientId, formData }) }}
            disabled={isPending}
            className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-background hover:bg-green-500"
                }`
            }
        >
            {isPending ? "Uploading..." : "Upload"}
        </button >
    );
}
