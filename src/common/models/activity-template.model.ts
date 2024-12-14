import { ActivityModel } from './activity.model'

export interface ActivityTemplateModel {
	id: string
	userId: string
	name: string
	description: string
	activities: ActivityModel[] | null
	createdAt: Date
	updatedAt: Date | null
}
