"use server";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

export async function uploadImageBlob(
  customerId: number,
  file: File|Blob
): Promise<{success:boolean, message:string, status:number}|
{error:string, status:number}> {
  if (!(file instanceof Blob)) {
    return { error: "Invalid file type.", status: 400 };
  }

  const { url } = await put("map-drawing.png", file, {
    access: "public",
    addRandomSuffix: true,
  });

  await sql`
    INSERT INTO images (customerID, imageURL, isActive)
    VALUES (${customerId}, ${url}, ${true});
  `;

  return { success: true, message: "Upload succeeded", status: 201 };
}

