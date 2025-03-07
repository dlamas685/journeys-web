import { RoadmapStatus } from '../../optimization/_enums/roadmap-status.enum'
import { SettingModel } from '../../optimization/_models/setting.model'

export interface CreateRoadmapModel {
	code?: string
	fleetId: string
	driverId: string
	vehicleId: string
	status?: RoadmapStatus
	startDateTime: string
	endDateTime: string
	setting: SettingModel
}
