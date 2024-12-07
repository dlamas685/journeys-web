import { FleetModel } from '../../fleets/_models'

export interface VehicleModel {
	id: string
	userId: string
	imageUrl: string | null
	fleet: FleetModel | null
	fleetId: string | null
	licensePlate: string
	make: string | null
	model: string | null
	year: number | null
	vin: string | null
	notes: string | null
	createdAt: Date
	updatedAt: Date | null
}
