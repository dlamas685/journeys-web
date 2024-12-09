export interface CreateVehicleModel {
	fleetId?: string | null
	licensePlate: string
	make?: string | null
	model?: string | null
	year?: number | null
	vin?: string | null
	notes?: string | null
}
