import { format } from 'date-fns'
import { TimestampModel } from '../models'

export const fromTimestamp = (timestamp: TimestampModel): string[] => {
	const milliseconds =
		(Number(timestamp.seconds) || 0) * 1000 +
		Math.floor((Number(timestamp.nanos) || 0) / 1e6)

	const dateObj = new Date(milliseconds)

	const date = format(dateObj, 'yyyy-MM-dd')
	const time = format(dateObj, 'HH:mm')

	return [date, time]
}
