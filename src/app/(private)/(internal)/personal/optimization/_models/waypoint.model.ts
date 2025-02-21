import { LocationModel } from '@/common/models'

export interface WaypointModel {
	placeId: string
	address: string
	location: LocationModel
	name: string
	vehicleStopover?: boolean
	via?: boolean
	sideOfRoad?: boolean
}
