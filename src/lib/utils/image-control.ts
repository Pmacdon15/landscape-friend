"use server";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

export async function uploadImageBlob(
  orgId: string,
  customerId: number,
  file: File | Blob
): Promise<{ success: boolean, message: string, status: number } |
{ error: string, status: number }> {
  if (!(file instanceof Blob)) {
    return { error: "Invalid file type.", status: 400 };
  }

  const clientResult = await sql`
    SELECT organization_id FROM clients WHERE id = ${customerId};
  `;

  if (!clientResult || clientResult.rowCount! <= 0) {
    return { error: "Client not found.", status: 404 };
  }

  const clientOrgId = clientResult.rows[0].organization_id;

  if (clientOrgId !== orgId) {
    return { error: "Customer ID does not belong to the organization.", status: 403 };
  }

  const { url } = await put("map-drawing.png", file, {
    access: "public",
    addRandomSuffix: true,
  });

  const sqlResults = await sql`
    INSERT INTO images (customerID, imageURL, isActive)
    VALUES (${customerId}, ${url}, ${true});
  `;
  if (!sqlResults || sqlResults == null || sqlResults.rowCount! <= 0 || sqlResults.command !== 'INSERT')
    return { error: "Failed to upload.", status: 400 };
  return { success: true, message: "Upload succeeded", status: 201 };
}



export async function uploadImageBlobServiceDone(
  orgId: string,
  customerId: number,
  file: File | Blob,
  isServiceImage = false
): Promise<{ status: number, url: string } |
{ error: string, status: number, url: string }> {
  if (!(file instanceof Blob)) {
    return { error: "Invalid file type.", status: 400, url: "" };
  }

  const clientResult = await sql`
    SELECT organization_id FROM clients WHERE id = ${customerId};
  `;

  if (!clientResult || clientResult.rowCount! <= 0) {
    return { error: "Client not found.", status: 404, url: "" };
  }

  const clientOrgId = clientResult.rows[0].organization_id;

  if (clientOrgId !== orgId) {
    return { error: "Customer ID does not belong to the organization.", status: 403, url: "" };
  }

  const { url } = await put(`${isServiceImage ? 'serviced-image' : 'map-drawing'}.png`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { status: 200, url: url }
}

