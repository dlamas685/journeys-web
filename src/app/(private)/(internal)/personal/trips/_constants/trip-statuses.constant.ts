import { TripStatus } from '../_enums'

export const TRIP_STATUSES: Record<
	TripStatus,
	{
		className: string
		label: string
	}
> = {
	CANCELLED: {
		className:
			'bg-transparent shadow-none border-red-500 text-red-500 font-semibold uppercase hover:bg-transparent hover:text-red-500',
		label: 'Cancelado',
	},

	COMPLETED: {
		className:
			'bg-transparent shadow-none border-green-500 text-green-500 font-semibold uppercase hover:bg-transparent hover:text-green-500',
		label: 'Completado',
	},

	ONGOING: {
		className:
			'bg-transparent shadow-none border-blue-500 text-blue-500 font-semibold uppercase hover:bg-transparent hover:text-blue-500',
		label: 'En curso',
	},

	UPCOMING: {
		className:
			'bg-transparent shadow-none border-yellow-500 text-yellow-500 font-semibold uppercase hover:bg-transparent hover:text-yellow-500',
		label: 'Pendiente',
	},
}
