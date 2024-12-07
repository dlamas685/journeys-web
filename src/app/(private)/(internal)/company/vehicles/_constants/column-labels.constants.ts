import { type VehicleModel } from '../_models'

export const COLUMN_LABELS: Record<keyof VehicleModel, string> = {
	id: 'ID',
	userId: 'ID de usuario',
	imageUrl: 'Imagen',
	fleetId: 'ID de flota',
	licensePlate: 'Placa',
	make: 'Marca',
	model: 'Modelo',
	year: 'Año',
	vin: 'VIN',
	createdAt: 'Creado',
	updatedAt: 'Actualizado',
	notes: 'Notas',
	fleet: 'Flota',
}
