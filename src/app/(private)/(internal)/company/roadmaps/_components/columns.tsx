'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { UPDATE_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
	CircleX,
	ClipboardCopy,
	ListCollapse,
	MoreHorizontal,
	Pencil,
	Replace,
	Save,
	SettingsIcon,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DriverModel } from '../../drivers/_models'
import { FleetModel } from '../../fleets/_models'
import Settings from '../../optimization/_components/settings'
import { VehicleModel } from '../../vehicles/_models'
import { ROADMAP_STATUS } from '../_constants'
import { RoadmapStatus } from '../_enums/roadmap-status.enum'
import { RoadmapModel } from '../_models'
import { toPresets } from '../_utils'
import ChangeStatusForm from './change-status-form'
import UpdateForm from './update-form'

const columns: ColumnDef<RoadmapModel>[] = [
	{
		accessorKey: 'code',
		header: () => <SortingButton field='code'>Alias</SortingButton>,
		enableHiding: false,
	},

	{
		id: 'date',
		enableHiding: false,
		header: () => <SortingButton field='startDateTime'>Fecha</SortingButton>,
		cell: ({ row }) => {
			const startDateTime = row.getValue<string>('startDateTime')

			return format(startDateTime, 'dd/MM/yyyy')
		},
	},
	{
		accessorKey: 'startDateTime',
		header: 'Hora de inicio',
		cell: ({ row }) => {
			const startDateTime = row.original.startDateTime

			return format(startDateTime, 'HH:mm')
		},
	},

	{
		accessorKey: 'endDateTime',
		header: 'Hora de fin',
		cell: ({ row }) => {
			const endDateTime = row.original.endDateTime

			return format(endDateTime, 'HH:mm')
		},
	},

	{
		accessorKey: 'fleet',
		header: () => <SortingButton field='fleet.name'>Flota</SortingButton>,
		cell: ({ row }) => {
			const fleet = row.getValue<FleetModel>('fleet')
			return fleet.name
		},
	},

	{
		accessorKey: 'driver',
		header: () => <SortingButton field='driver.name'>Conductor</SortingButton>,
		cell: ({ row }) => {
			const driver = row.getValue<DriverModel>('driver')
			return driver.name
		},
	},

	{
		accessorKey: 'vehicle',
		header: () => (
			<SortingButton field='vehicle.licensePlate'>Vehículo</SortingButton>
		),
		cell: ({ row }) => {
			const vehicle = row.getValue<VehicleModel>('vehicle')
			return vehicle.licensePlate
		},
	},

	{
		accessorKey: 'status',
		enableHiding: false,
		header: () => <SortingButton field='status'>Estado</SortingButton>,
		cell: ({ row }) => {
			const status = row.getValue<RoadmapStatus>('status')
			return (
				<Badge
					className={cn(
						'w-24 justify-center',
						ROADMAP_STATUS[status].className
					)}>
					{ROADMAP_STATUS[status].label}
				</Badge>
			)
		},
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const record = row.original

			const presets = toPresets(record.setting)

			const handleCopy = () => {
				navigator.clipboard
					.writeText(record.code)
					.then(() => {
						toast.info('Alias copiado al portapapeles')
					})
					.catch(() => {
						toast.error('No se pudo copiar el alias')
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
							<ResponsiveSheet
								label='Configuración'
								title='Configuración'
								icon={<SettingsIcon className='size-4' />}
								description='En esta vista previa podrás ver las configuraciones establecidas para optimizar la hoja de rutas que has seleccionado.'
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
								}}>
								<Settings presets={presets} />
							</ResponsiveSheet>
						</DropdownMenuItem>

						{record.results && (
							<DropdownMenuItem asChild>
								<Link href={`${Pathnames.ROADMAPS}/${record.id}`}>
									<ListCollapse className='mr-1 size-4' />
									Detalles
								</Link>
							</DropdownMenuItem>
						)}

						{record.status !== RoadmapStatus.DISMISSED && (
							<Modal
								title='Cambiar Estado de Hoja de Ruta'
								description='Modifica el estado de la hoja de ruta de forma manual.'
								triggerIcon={<Replace className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
								}}
								triggerLabel='Estado'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPDATE_FORM_ID,
								}}>
								<ChangeStatusForm record={record} />
							</Modal>
						)}

						<DropdownMenuSeparator />

						<DropdownMenuItem asChild>
							<Modal
								title='Editar Hoja de Ruta'
								description='Modifica los datos de la hoja de ruta. Ten en cuenta que el alias es un campo obligatorio.'
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
									form: UPDATE_FORM_ID,
								}}>
								<UpdateForm record={record} />
							</Modal>
						</DropdownMenuItem>
						{record.status !== RoadmapStatus.ONGOING && (
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
											¿Estás seguro de que deseas eliminar la hoja de ruta{' '}
											<b className='capitalize'>{record.code}</b>? Esta acción
											no se puede deshacer.
										</>
									}
									eraserButton={({ setOpen }) => (
										<EraserButton
											recordId={record.id}
											endpoint={ApiEndpoints.ROADMAPS}
											setAlertOpen={setOpen}
											title='Hojas de Ruta'
											description='Hoja de ruta eliminada correctamente.'
										/>
									)}
								/>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default columns
