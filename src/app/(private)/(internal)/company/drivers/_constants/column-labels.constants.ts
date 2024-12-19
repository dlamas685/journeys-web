import type { DriverModel } from '../_models'

export const COLUMN_LABELS: Record<keyof DriverModel, string> = {
	id: 'ID',
	userId: 'ID de usuario',
	fleetId: 'ID de flota',
	licenseNumber: 'Número de licencia',
	name: 'Nombre',
	imageUrl: 'Imagen',
	notes: 'Notas',
	createdAt: 'Creado',
	updatedAt: 'Actualizado',
	fleet: 'Flota',
}
