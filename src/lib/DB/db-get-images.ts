import { neon } from '@neondatabase/serverless'

//MARK: Get Serviced URLs
export async function getServicedImagesUrlsDb(
	clientId: number,
): Promise<{ date: Date; imageurl: string }[]> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = (await sql` 
      (
      SELECT 
        ymc.cutting_date AS date,
        img.imageurl
        FROM yards_marked_cut ymc
        JOINimages_serviced_dev_tester img ON img.fk_cut_id = ymc.id
        WHERE ymc.client_id = ${clientId}
      UNION
      SELECT 
      ymc.clearing_date AS date,
      img.imageurl
        FROM yards_marked_clear ymc
        JOIN images_serviced_dev_tester img ON img.fk_clear_id = ymc.id
        WHERE ymc.client_id = ${clientId}
      )
      ORDER BY date DESC
    `) as { date: Date; imageurl: string }[]
		// console.log(result)
		return result
	} catch (error) {
		console.error('Error in getting Serviced Images Urls:', error)
		return []
	}
}
