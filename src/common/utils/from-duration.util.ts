import { DurationModel } from '../models'

export const fromDuration = (duration: DurationModel): string => {
	const totalSeconds = Number(duration.seconds || 0)

	const hours = Math.floor(totalSeconds / 3600)

	const minutes = Math.floor((totalSeconds % 3600) / 60)

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
