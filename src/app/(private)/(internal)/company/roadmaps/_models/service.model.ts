import { CreateActivityModel } from '@/common/models'
import { WaypointModel } from './waypoint.model'

export interface ServiceModel extends CreateActivityModel {
	id: string
	duration: number
	waypoint: WaypointModel
}
