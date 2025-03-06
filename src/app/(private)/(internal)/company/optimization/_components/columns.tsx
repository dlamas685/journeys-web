'use client'
import { ActivityModel } from '@/common/models'
import { formatTime } from '@/common/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef, FilterFn, Row } from '@tanstack/react-table'

const myCustomFilterFn: FilterFn<ActivityModel> = (
	row: Row<ActivityModel>,
	columnId: string,
	filterValue: string,
	addMeta: (meta: any) => void
) => {
	filterValue = filterValue.toLowerCase()
	const filterParts = filterValue.split(' ')
	const rowValues =
		`${row.original.name} ${row.original.duration}`.toLowerCase()

	return filterParts.every(part => rowValues.includes(part))
}

const columns: ColumnDef<ActivityModel>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Seleccionar todas las actividades de la página'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label={`Seleccionar a ${row.original.name}`}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: 'Nombre',
		filterFn: myCustomFilterFn,
		enableHiding: false,
	},
	{
		accessorKey: 'description',
		header: 'Descripción',
		cell: ({ row }) => row.getValue<string>('description') || 'N/D',
	},
	{
		accessorKey: 'duration',
		header: 'Duración',
		filterFn: myCustomFilterFn,
		cell: ({ row }) => {
			const duration = row.getValue<number | undefined>('duration')

			return duration ? formatTime(duration) : 'N/D'
		},
	},
]

export default columns
