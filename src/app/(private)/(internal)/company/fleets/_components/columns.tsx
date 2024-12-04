'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import { Pathnames } from '@/common/enums'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
	Car,
	ClipboardCopy,
	MoreHorizontal,
	Pencil,
	Trash2,
	UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { FleetModel } from '../_models'

const columns: ColumnDef<FleetModel>[] = [
	{
		accessorKey: 'name',
		header: () => <SortingButton field='name'>Nombre</SortingButton>,
		enableHiding: false,
	},
	{
		accessorKey: 'description',
		header: () => (
			<SortingButton field='description'>Descripción</SortingButton>
		),
		cell: ({ row }) => {
			const description = row.getValue<string>('description') || 'N/D'

			return (
				<div className='max-w-80 truncate' title={description}>
					{description}
				</div>
			)
		},
	},
	{
		accessorKey: 'maxDrivers',
		header: () => <SortingButton field='maxDrivers'>MDC</SortingButton>,
		enableHiding: false,
	},
	{
		accessorKey: 'maxVehicles',
		header: () => <SortingButton field='maxVehicles'>MDV</SortingButton>,
		enableHiding: false,
	},
	{
		accessorKey: 'createdAt',
		header: () => <SortingButton field='createdAt'>Creado</SortingButton>,
		cell: ({ row }) => format(row.getValue<Date>('createdAt'), 'dd/MM/yyyy'),
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const fleet = row.original

			const handleCopy = () => {
				navigator.clipboard
					.writeText(fleet.name)
					.then(() => {
						toast.info('Nombre copiado al portapapeles')
					})
					.catch(() => {
						toast.error('No se pudo copiar el nombre')
					})
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuItem onClick={handleCopy}>
							<ClipboardCopy className='mr-1 size-4' />
							Copiar nombre
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Pencil className='mr-1 size-4' />
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Trash2 className='mr-1 size-4' />
							Eliminar
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`${Pathnames.FLEETS}/${fleet.id}/${Pathnames.DRIVERS}`}>
								<UsersRound className='mr-1 size-4' />
								Conductores
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`${Pathnames.FLEETS}/${fleet.id}/${Pathnames.VEHICLES}`}>
								<Car className='mr-1 size-4' />
								Vehículos
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default columns
