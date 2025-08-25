'use client'
import { useUploadImage } from "@/lib/mutations/mutations";
import { toast } from "sonner";
import Spinner from "../spinner";

export default function UploadImageButton({ clientId, setView }: { clientId: number, setView: React.Dispatch<React.SetStateAction<string>> }) {
    const { mutate, isPending } = useUploadImage({
        onSuccess: () => {
            toast.success("Image uploaded successfully!", { duration: 1500 });
            setView("list")

        },
        onError: (error) => {
            console.error("Upload failed:", error);
            toast.error("Image upload failed!", { duration: 1500 });
        }
    });
    return (
        <button
            formAction={(formData: FormData) => { mutate({ clientId: clientId, formData }) }}
            disabled={isPending}
            className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${isPending
                ? "bg-green-400 cursor-not-allowed"
                : "bg-background hover:bg-green-500"
                }`
            }
        >
            {isPending ? <div className="flex md:gap-8 justify-center">Uploading...<Spinner /></div> : "Upload"}
        </button >
    );
}
