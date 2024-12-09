import { VehicleModel } from '../../vehicles/_models'

export interface FleetModel {
	id: string
	userId: string
	name: string
	description: string
	maxVehicles: number
	maxDrivers: number
	createdAt: Date
	vehicles: VehicleModel[]
	updatedAt: Date | null
}
