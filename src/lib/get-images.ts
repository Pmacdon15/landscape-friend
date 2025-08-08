import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function FetchAllImagesByCustomerIdDb(customerId: number) {
  const urls = await sql`
    SELECT imageurl
    FROM images
    WHERE customerid = ${customerId} AND isactive = 'true';
    `;
  const response = urls.rows;

  return response;
}
