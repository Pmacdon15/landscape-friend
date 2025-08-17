"use server";
import { uploadImageBlob } from "@/lib/upload";
import { ImageSchema } from "@/lib/zod/schemas";
import { revalidatePath } from "next/cache";

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

  let result
  try {
    const image = formData.get("image");
    const validatedImage = ImageSchema.safeParse({ image });

    if (!validatedImage.success) throw new Error("invaild inputs")

    result = await uploadImageBlob(customerId, validatedImage.data.image);
    if (result && 'error' in result) {
      throw new Error(result.error);
    }

  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
  revalidatePath("/lists/client")
  revalidatePath("/lists/cutting")
  revalidatePath("/lists/clearing")
  return result
}


export async function uploadDrawing(file: Blob, clientId: number)
  : Promise<
    | { success: boolean; message: string; status: number }
    | { error: string; status: number }
    | Error
    | null
  > {
  let result
  try {
    result = await uploadImageBlob(clientId, file);
    if (result && 'error' in result) {
      throw new Error(result.error);
    }
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
  revalidatePath("/lists/client")
  revalidatePath("/lists/cutting")
  revalidatePath("/lists/clearing")
  return result
}

