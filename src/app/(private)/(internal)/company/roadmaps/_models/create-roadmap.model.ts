import { SettingModel } from '../../optimization/_models/setting.model'
import { RoadmapStatus } from '../_enums/roadmap-status.enum'

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
