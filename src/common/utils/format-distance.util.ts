export function formatDistance(meters: number, decimals: number = 2): string {
	if (meters < 0) throw new Error('La distancia no puede ser negativa')

	if (meters < 1000) {
		return `${meters} m`
	}

	const kilometers = meters / 1000
	return `${kilometers.toFixed(decimals)} km`
}
