import { neon } from '@neondatabase/serverless'

// MARK: Get Serviced URLs by Address ID
export async function getServicedImagesUrlsDb(
	addressId: number,
): Promise<{ date: Date; imageurl: string }[]> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = (await sql`
      SELECT img.created_at AS date,
             img.imageurl
      FROM images_serviced img
      LEFT JOIN yards_marked_cut ymc ON img.fk_cut_id = ymc.id
      LEFT JOIN yards_marked_clear ymc2 ON img.fk_clear_id = ymc2.id
      WHERE ymc.address_id = ${addressId} OR ymc2.address_id = ${addressId}
      ORDER BY date DESC
    `) as { date: Date; imageurl: string }[]

		console.log('Serviced images for address:', addressId, result)
		if (result.length < 1) return []
		return result
	} catch (error) {
		console.error('Error in getting Serviced Images Urls:', error)
		return []
	}
}
