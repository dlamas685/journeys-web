import type { FleetModel } from '../_models'

export const COLUMN_LABELS: Record<keyof FleetModel, string> = {
	description: 'Descripción',
	createdAt: 'Creado',
	id: 'ID',
	userId: 'ID de usuario',
	name: 'Nombre',
	maxVehicles: 'Máximo de vehículos',
	maxDrivers: 'Máximo de conductores',
	updatedAt: 'Fecha de actualización',
}
