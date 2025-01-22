import { ActivityModel } from '@/common/models'

export interface AdvancedWaypointActivityModel
	extends Partial<Omit<ActivityModel, 'duration'>> {
	duration?: string
}
