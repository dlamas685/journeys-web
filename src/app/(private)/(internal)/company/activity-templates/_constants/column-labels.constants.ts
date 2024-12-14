import { ActivityTemplateModel } from '@/common/models'

export const COLUMN_LABELS: Record<keyof ActivityTemplateModel, string> = {
	id: 'ID',
	userId: 'ID de usuario',
	name: 'Nombre',
	description: 'Descripción',
	activities: 'Actividades',
	createdAt: 'Creado',
	updatedAt: 'Actualizado',
}

export const OTHER_COLUMN_LABELS = {
	totalTime: 'Tiempo',
	totalActivities: 'Actividades',
}
