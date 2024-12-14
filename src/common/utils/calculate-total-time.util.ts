import { ActivityModel } from '../models'

export const calculateTotalTime = (activities: ActivityModel[]) => {
	const totalMinutes = activities.reduce(
		(accumulator, activity) => accumulator + (activity.duration ?? 0),
		0
	)
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60
	return `${hours} horas ${minutes > 0 ? `con ${minutes} minutos` : ''}`
}
