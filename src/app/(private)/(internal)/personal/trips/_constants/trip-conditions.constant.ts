export const TRIP_CONDITIONS: Record<
	string,
	{
		className: string
		label: string
	}
> = {
	true: {
		className:
			'bg-transparent shadow-none border-yellow-500 text-yellow-500 font-semibold uppercase hover:bg-transparent hover:text-yellow-500',
		label: 'Cancelado',
	},

	false: {
		className:
			'bg-transparent shadow-none border-green-500 text-green-500 font-semibold uppercase hover:bg-transparent hover:text-green-500',
		label: 'Completado',
	},
}
