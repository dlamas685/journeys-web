import { ActivityModel } from './activity.model'
import { CreateActivityTemplate } from './create-activity-template.model'

export interface UpdateActivityTemplateModel
	extends Partial<CreateActivityTemplate> {
	activities?: ActivityModel[]
}
