export async function isSnowing(
	lat: number,
	lon: number,
	forceSnow: boolean = false,
): Promise<boolean> {
	if (forceSnow) return true
	try {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=snowfall&forecast_days=1`,
		)
		const data = await response.json()

		if (data && data.hourly && data.hourly.snowfall) {
			// Check if any of the hourly snowfall forecasts are greater than 0
			return data.hourly.snowfall.some((snowfall: number) => snowfall > 0)
		}

		return false
	} catch (error) {
		console.error('Error fetching weather data:', error)
		return false
	}
}
