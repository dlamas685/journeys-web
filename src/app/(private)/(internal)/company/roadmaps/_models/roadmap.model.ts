import { DriverModel } from '../../drivers/_models'
import { FleetModel } from '../../fleets/_models'
import { RoadmapStatus } from '../../optimization/_enums/roadmap-status.enum'
import { RoadmapOptimizationModel } from '../../optimization/_models/roadmap-optimization.model'
import { SettingModel } from '../../optimization/_models/setting.model'
import { VehicleModel } from '../../vehicles/_models'

export interface RoadmapModel {
	id: string
	userId: string
	fleetId: string
	vehicleId: string
	driverId: string

	fleet: FleetModel
	driver: DriverModel
	vehicle: VehicleModel

	code: string
	startDateTime: Date
	endDateTime: Date
	status: RoadmapStatus
	setting: SettingModel
	results: RoadmapOptimizationModel
	createdAt: Date
	updatedAt: Date | null
}
