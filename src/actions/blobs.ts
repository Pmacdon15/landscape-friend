"use server";
import { uploadImageBlob } from "@/lib/upload";
import { ImageSchema } from "@/lib/zod/schemas";

export async function uploadImage(
  customerId: number,
  formData: FormData,
): Promise<
  | { success: boolean; message: string; status: number }
  | { error: string; status: number }
  | { error: { image: string[] | undefined }; status: number }
  | Error
  | null
> {
  try {
    const image = formData.get("image");
    const validatedImage = ImageSchema.safeParse({ image });

    if (!validatedImage.success) throw new Error("invaild inputs")


    const result = await uploadImageBlob(customerId, validatedImage.data.image);
    if (!result) return null;
    return result;
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
}


export async function uploadDrawing(file: Blob, clientId: number)
  : Promise<
    | { success: boolean; message: string; status: number }
    | { error: string; status: number }
    | Error
    | null
  > {
  try {
    const result = await uploadImageBlob(clientId, file);
    if (!result) return null;
    return result;
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
}

