import { addHours, addMinutes } from 'date-fns'
import { TimestampModel } from '../_models'

export const toTimestamp = (date: Date, time: string): TimestampModel => {
	const baseDate = new Date(date)

	const [hours, minutes] = time.split(':').map(Number)

	const fullDate = addMinutes(addHours(baseDate, hours), minutes)

	const seconds = Math.floor(fullDate.getTime() / 1000)
	const nanos = (fullDate.getTime() % 1000) * 1e6

	return {
		seconds,
		nanos,
	} as TimestampModel
}
