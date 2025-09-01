import { neon } from "@neondatabase/serverless";

//MARK: Get Servided URLs
export async function getServicedImagesUrls(clientId:number): Promise<{ date:Date, image_url: string}[]> {
 
  const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const result = await (sql`
    (
      SELECT cutting_date AS date, image_url
      FROM yards_marked_cut
      WHERE client_id = ${clientId}
      UNION
      SELECT clearing_date AS date, image_url
      FROM yards_marked_clear
      WHERE client_id = ${clientId}
    )
    ORDER BY date DESC
    LIMIT 1;
    `) as { date: Date, image_url: string}[];
    console.log(result)
    return result;
  } catch (error) {
    console.error("Error in getting Serviced Images Urls:", error);
    throw error;
  }
}
