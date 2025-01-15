import { format } from 'date-fns'
import { TimestampModel } from '../_models'

export const fromTimestamp = (timestamp: TimestampModel): [Date, string] => {
	const milliseconds =
		(timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1e6

	const fullDate = new Date(milliseconds)

	const date = new Date(
		fullDate.getFullYear(),
		fullDate.getMonth(),
		fullDate.getDate()
	)

	const time = format(fullDate, 'HH:mm')

	return [date, time]
}
