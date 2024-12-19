import { FleetModel } from '../../fleets/_models'

export interface DriverModel {
	id: string
	userId: string
	fleetId: string | null
	licenseNumber: string
	name: string
	imageUrl: string | null
	notes: string | null
	createdAt: Date
	updatedAt: Date | null
	fleet: FleetModel | null
}
