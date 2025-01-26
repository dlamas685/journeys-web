import { getUnixTime } from 'date-fns/getUnixTime'
import { parseISO } from 'date-fns/parseISO'
import { set } from 'date-fns/set'
import { TimestampModel } from '../models'

export const toTimestamp = (date: string, time: string): TimestampModel => {
	const baseDate = parseISO(date)

	const [hours, minutes] = time.split(':').map(Number)

	const adjustedDate = set(baseDate, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0,
	})

	const seconds = getUnixTime(adjustedDate)

	const nanos = 0

	return { seconds, nanos }
}
