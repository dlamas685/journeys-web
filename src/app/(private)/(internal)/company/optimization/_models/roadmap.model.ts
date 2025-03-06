import { RoadmapStatus } from '../_enums/roadmap-status.enum'
import { RoadmapOptimizationModel } from './roadmap-optimization.model'
import { SettingModel } from './setting.model'

export interface RoadmapModel {
	id: string
	userId: string
	fleetId: string
	vehicleId: string
	driverId: string
	code: string
	startDateTime: Date
	endDateTime: Date
	status: RoadmapStatus
	setting: SettingModel
	results: RoadmapOptimizationModel
	createdAt: Date
	updatedAt: Date | null
}
