export const formatHHMM = (timeString: string) => {
	const [hours, minutes] = timeString.split(':').map(Number)

	if (hours > 0 && minutes > 0) {
		return `${hours}h ${minutes}min`
	} else if (hours > 0) {
		return `${hours}h`
	} else {
		return `${minutes}min`
	}
}
