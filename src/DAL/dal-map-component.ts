"use server";
import { FetchAllImagesByCustomerIdDb } from "@/lib/get-images";
import { FetchUploadImageBlob } from "@/lib/upload";

//////////////////////////////////////////////////////////////////////////////
export async function FetchAllImagesByCustomerId(
  customerId: number
){
  

  try {
    const result = await FetchAllImagesByCustomerIdDb(customerId);
    if (!result) return null;
    console.warn(result);
    return result;
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
}

export async function FetchUploadImage(
  customerId: number,
  file: File
): Promise<
  | { success: boolean; message: string; status: number }
  | { error: string; status: number }
  | Error
  | null
> {
  try {
    const result = await FetchUploadImageBlob(customerId, file);
    if (!result) return null;
    console.warn(result);
    return result;
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
}


export async function uploadDrawing(file:Blob, clientId: number)
: Promise<
  | { success: boolean; message: string; status: number }
  | { error: string; status: number }
  | Error
  | null
> {
  try {
    const result = await FetchUploadImageBlob(clientId, file);
    if (!result) return null;
    console.warn(result);
    return result;
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("An unknown error occurred");
  }
}


//////////////////////////////////////////////////////////////////////////////
