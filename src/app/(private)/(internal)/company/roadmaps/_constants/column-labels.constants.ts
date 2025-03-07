import type { RoadmapModel } from '../_models'

export const COLUMN_LABELS: Record<keyof RoadmapModel | string, string> = {
	code: 'Alias',
	endDateTime: 'Hora de fin',
	startDateTime: 'Hora de inicio',
	date: 'Fecha',
	driver: 'Conductor',
	fleet: 'Flota',
	vehicle: 'Vehículo',
	status: 'Estado',
	setting: 'Configuración',
	createdAt: 'Creado el',
}
