import { formatISO, parse } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function convertToUTCISO(dateStr: string, timeStr: string): string {
	const dateTimeString = `${dateStr} ${timeStr}`

	const localDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date())

	const utcDate = toZonedTime(localDate, 'UTC')

	return formatISO(utcDate, { representation: 'complete' }).replace(
		/-?\d{2}:\d{2}$/,
		'Z'
	)
}
