import { LocationModel } from '../../../../../../common/models/location.model'

export type Waypoint = {
	placeId: string
	location: LocationModel
	address: string
	name?: string
	sideOfRoad?: boolean
	via?: boolean
	vehicleStopover?: boolean
}
