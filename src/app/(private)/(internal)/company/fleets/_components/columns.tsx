'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
	Car,
	CircleX,
	ClipboardCopy,
	MoreHorizontal,
	Pencil,
	Save,
	Trash2,
	UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { FleetModel } from '../_models'
import UpsertForm from './upsert-form'

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
		header: () => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<SortingButton field='maxDrivers'>CC</SortingButton>
					</TooltipTrigger>
					<TooltipContent align='center' className='bg-muted-foreground'>
						<p>Cantidad de conductores</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
		enableHiding: false,
		cell: ({ row }) => {
			const maxDrivers = row.getValue<number | null>('maxDrivers')
			const amountLinkedDrivers = row.original.drivers.length

			return maxDrivers ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								className={cn('font-medium', {
									'text-red-500': amountLinkedDrivers >= maxDrivers,
									'text-green-500': amountLinkedDrivers < maxDrivers,
								})}>
								{maxDrivers}
							</span>
						</TooltipTrigger>
						<TooltipContent align='center' className='bg-muted-foreground'>
							<p>
								{amountLinkedDrivers === 0
									? 'No hay conductores vinculados'
									: `${amountLinkedDrivers} conductores vinculados`}{' '}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				'N/D'
			)
		},
	},
	{
		accessorKey: 'maxVehicles',
		header: () => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<SortingButton field='maxVehicles'>CV</SortingButton>
					</TooltipTrigger>
					<TooltipContent align='center' className='bg-muted-foreground'>
						<p>Cantidad de vehículos</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
		enableHiding: false,
		cell: ({ row }) => {
			const maxVehicles = row.getValue<number | null>('maxVehicles')
			const amountLinkedVehicles = row.original.vehicles.length

			return maxVehicles ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								className={cn('font-medium', {
									'text-red-500': amountLinkedVehicles >= maxVehicles,
									'text-green-500': amountLinkedVehicles < maxVehicles,
								})}>
								{maxVehicles}
							</span>
						</TooltipTrigger>
						<TooltipContent align='center' className='bg-muted-foreground'>
							<p>
								{amountLinkedVehicles === 0
									? 'No hay vehículos vinculados'
									: `${amountLinkedVehicles} vehículos vinculados`}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				'N/D'
			)
		},
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
			const record = row.original

			const handleCopy = () => {
				navigator.clipboard
					.writeText(record.name)
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
						<DropdownMenuItem asChild>
							<Modal
								title='Editar Dirección Favorita'
								description='Modifica los datos de la dirección favorita. Ten en cuenta que algunos campos son opcionales.'
								triggerIcon={<Pencil className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
								}}
								triggerLabel='Editar'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPSERT_FORM_ID,
								}}>
								<UpsertForm record={record} />
							</Modal>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<RemovalAlert
								triggerLabel='Eliminar'
								triggerIcon={<Trash2 className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
								}}
								cancelIcon={<CircleX className='mr-1 size-4' />}
								description={
									<>
										¿Estás seguro de que deseas eliminar la flota{' '}
										<b className='capitalize'>{record.name}</b>? Esta acción no
										se puede deshacer.
									</>
								}
								eraserButton={({ setOpen }) => (
									<EraserButton
										recordId={record.id}
										endpoint={ApiEndpoints.FLEETS}
										setAlertOpen={setOpen}
										title='Flotas'
										description='Flota eliminada correctamente.'
									/>
								)}
							/>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`${Pathnames.FLEETS}/${record.id}/${Pathnames.DRIVERS}`}>
								<UsersRound className='mr-1 size-4' />
								Conductores
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`${Pathnames.FLEETS}/${record.id}/${Pathnames.VEHICLES}`}>
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
