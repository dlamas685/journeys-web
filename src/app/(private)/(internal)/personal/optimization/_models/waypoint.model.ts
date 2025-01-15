export interface WaypointModel {
	placeId: string
	location: google.maps.LatLngLiteral
	address: string
	sideOfRoad?: boolean
	via?: boolean
	vehicleStopover?: boolean
}
