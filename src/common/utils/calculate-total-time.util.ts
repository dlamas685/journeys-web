import { ActivityModel } from '../models'
import { formatTime } from './format-time.util'

export const calculateTotalTime = (activities: ActivityModel[]) => {
	const totalSeconds = activities.reduce(
		(accumulator, activity) => accumulator + (activity.duration ?? 0),
		0
	)
	return formatTime(totalSeconds)
}
