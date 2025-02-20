import { LocationModel } from '@/common/models'

export interface WaypointModel {
	placeId: string
	address: string
	location: LocationModel
	vehicleStopover?: boolean
	via?: boolean
	sideOfRoad?: boolean
}
