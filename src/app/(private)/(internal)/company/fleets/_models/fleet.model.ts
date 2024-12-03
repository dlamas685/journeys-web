export interface FleetModel {
	id: string
	userId: string
	name: string
	description: string
	maxVehicles: number
	maxDrivers: number
	createdAt: Date
	updatedAt: Date | null
}
