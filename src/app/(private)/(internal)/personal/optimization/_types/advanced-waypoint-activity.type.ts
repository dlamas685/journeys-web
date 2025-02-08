import { ActivityModel } from '@/common/models'

export type AdvancedWaypointActivity = Partial<
	Omit<ActivityModel, 'duration'>
> & {
	duration?: string
}
