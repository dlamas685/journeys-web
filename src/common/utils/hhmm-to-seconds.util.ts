export const hhmmToSeconds = (timeString: string) => {
	const [hours, minutes] = timeString.split(':').map(Number)
	return hours * 3600 + minutes * 60
}
