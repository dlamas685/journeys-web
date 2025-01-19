import { ActivityModel } from '@/common/models'

export interface WaypointActivityModel
	extends Partial<Omit<ActivityModel, 'duration'>> {
	duration: string
}
