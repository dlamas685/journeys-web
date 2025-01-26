import { DurationModel } from '../models'

export const toDuration = (time: string): DurationModel => {
	const [hours, minutes] = time.split(':').map(Number)

	const totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60

	const nanos = 0

	return { seconds: totalSeconds, nanos }
}
