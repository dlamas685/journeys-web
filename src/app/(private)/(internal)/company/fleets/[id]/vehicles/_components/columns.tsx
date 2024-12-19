'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import Modal from '@/common/components/ui/overlay/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardCopy, ListCollapse, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import Detail from '../../../../vehicles/_components/detail'
import { VehicleModel } from '../../../../vehicles/_models'

const columns: ColumnDef<VehicleModel>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Seleccionar todos los vehículos en la página'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label={`Seleccionar vehículo con patente ${row.original.licensePlate}`}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'imageUrl',
		header: 'Imagen',
		cell: ({ row }) => {
			const imageUrl = row.getValue<string | null>('imageUrl')

			return (
				<Image
					src={imageUrl ?? '/photos/car-placeholder.png'}
					alt={`Imagen del vehículo con placa ${row.original.licensePlate}`}
					width={44}
					height={44}
					className='size-11 object-contain'
				/>
			)
		},
		enableHiding: false,
	},
	{
		accessorKey: 'licensePlate',
		header: () => <SortingButton field='licensePlate'>Patente</SortingButton>,
		enableHiding: false,
	},
	{
		accessorKey: 'make',
		header: () => <SortingButton field='make'>Marca</SortingButton>,
		cell: ({ row }) => row.getValue<number>('make') ?? 'N/D',
	},
	{
		accessorKey: 'model',
		header: () => <SortingButton field='model'>Modelo</SortingButton>,
	},
	{
		accessorKey: 'year',
		header: () => <SortingButton field='year'>Año</SortingButton>,
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const record = row.original

			const handleCopy = () => {
				navigator.clipboard
					.writeText(record.licensePlate)
					.then(() => {
						toast.info('Patente copiada al portapapeles')
					})
					.catch(() => {
						toast.error('No se pudo copiar la patente del vehículo')
					})
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label='Abrir panel de acciones'
							aria-disabled='false'
							type='button'
							variant='ghost'
							className='size-8 p-0'>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuItem
							aria-disabled={false}
							aria-label='Copiar patente'
							onClick={handleCopy}>
							<ClipboardCopy className='mr-1 size-4' />
							Copiar patente
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Modal
								title='Detalles del Vehículo'
								description='Puedes editar estos campos desde el panel de edición en la sección Vehículos.'
								triggerIcon={<ListCollapse className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Ver detalles del vehículo ${record.licensePlate}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Ver detalles'
								isReadonly>
								<Detail record={record} />
							</Modal>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default columns
