import { RoadmapStatus } from '../_enums/roadmap-status.enum'

export interface ChangeStatusModel {
	id: string
	status: RoadmapStatus
}
