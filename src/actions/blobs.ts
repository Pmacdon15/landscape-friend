"use server";
import { uploadImageBlob } from "@/lib/upload";

export async function uploadImage(
  customerId: number,
  file: File
): Promise<
  | { success: boolean; message: string; status: number }
  | { error: string; status: number }
  | Error
  | null
> {
  try {
    const result = await uploadImageBlob(customerId, file);
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

