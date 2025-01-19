import { differenceInSeconds, parse, startOfDay } from 'date-fns'

export const convertToSeconds = (time: string): number => {
	const parsedTime = parse(time, 'HH:mm', new Date())
	return differenceInSeconds(parsedTime, startOfDay(parsedTime))
}
