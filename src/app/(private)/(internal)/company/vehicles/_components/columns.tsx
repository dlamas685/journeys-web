'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import ImageUpload from '@/common/components/ui/misc/image-upload'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints } from '@/common/enums'
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
	CircleX,
	ClipboardCopy,
	ImageMinus,
	ImageUp,
	ListCollapse,
	MoreHorizontal,
	Pencil,
	Save,
	Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { FleetModel } from '../../fleets/_models'
import { VehicleModel } from '../_models'
import Detail from './detail'
import UpsertForm from './upsert-form'

const columns: ColumnDef<VehicleModel>[] = [
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
		accessorKey: 'fleet',
		header: () => <SortingButton field='fleet.name'>Flota</SortingButton>,
		cell: ({ row }) => {
			const fleet = row.getValue<FleetModel | null>('fleet')

			return fleet?.name ?? 'N/D'
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
								description='Puedes editar estos campos desde el panel de edición.'
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
						<DropdownMenuItem asChild>
							<Modal
								title='Editar Vehículo'
								description='Modifica los datos del vehículo. Ten en cuenta que algunos campos son opcionales.'
								triggerIcon={<Pencil className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Editar vehículo ${record.licensePlate}`,
									'aria-disabled': 'false',
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
									'aria-label': `Eliminar vehículo ${record.licensePlate}`,
									'aria-disabled': 'false',
								}}
								cancelIcon={<CircleX className='mr-1 size-4' />}
								description={
									<>
										¿Estás seguro de que deseas eliminar el vehículo{' '}
										<b className='capitalize'>{record.licensePlate}</b>? Esta
										acción no se puede deshacer.
									</>
								}
								eraserButton={({ setOpen }) => (
									<EraserButton
										recordId={record.id}
										endpoint={ApiEndpoints.VEHICLES}
										setAlertOpen={setOpen}
										title='Vehículos'
										description='Vehículo eliminado correctamente.'
									/>
								)}
							/>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuLabel>Imagen</DropdownMenuLabel>

						{record.imageUrl ? (
							<DropdownMenuItem asChild>
								<RemovalAlert
									title='Remover Imagen'
									triggerLabel='Remover'
									triggerIcon={<ImageMinus className='mr-1 size-3.5' />}
									triggerProps={{
										className:
											'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
										variant: 'ghost',
										'aria-label': `Eliminar imagen del vehículo ${record.licensePlate}`,
										'aria-disabled': 'false',
									}}
									cancelIcon={<CircleX className='mr-1 size-4' />}
									description={
										<>
											¿Estás seguro de que deseas remover la imagen del vehículo{' '}
											<b className='capitalize'>{record.licensePlate}</b>? Esta
											acción no se puede deshacer.
										</>
									}
									eraserButton={({ setOpen }) => (
										<EraserButton
											recordId={record.id}
											endpoint={ApiEndpoints.FILES_VEHICLES}
											setAlertOpen={setOpen}
											title={`Vehículo ${record.licensePlate}`}
											description='Imagen removida correctamente.'
										/>
									)}
								/>
							</DropdownMenuItem>
						) : (
							<Modal
								title={`Imagen del vehículo ${record.licensePlate}`}
								description='Sube una imagen del vehículo. Ten en cuenta que la imagen debe cumplir lo siguiente: *.png, *.jpg archivos de hasta 10 MB con al menos 400px por 400px.'
								triggerIcon={<ImageUp className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Cargar imagen al vehículo ${record.licensePlate}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Cargar'
								isReadonly>
								<section className='px-4 pb-4 sm:px-0 sm:pb-0'>
									<ImageUpload
										recordId={record.id}
										endpoint={ApiEndpoints.FILES_VEHICLES}
										entity={`Vehículo ${record.licensePlate}`}
									/>
								</section>
							</Modal>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default columns
