import { Location } from './location.type'

export type Waypoint = {
	placeId: string
	location: Location
	address: string
	name: string
	sideOfRoad?: boolean
	via?: boolean
	vehicleStopover?: boolean
}
