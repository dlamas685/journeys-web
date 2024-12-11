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
import { type ColumnDef } from '@tanstack/react-table'
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
import { type FleetModel } from '../../fleets/_models'
import { type DriverModel } from '../_models'
import Detail from './detail'

const columns: ColumnDef<DriverModel>[] = [
	{
		accessorKey: 'imageUrl',
		header: 'Imagen',
		cell: ({ row }) => {
			const imageUrl = row.getValue<string | null>('imageUrl')

			return (
				<Image
					src={imageUrl ?? '/photos/young-man-placeholder.png'}
					alt={`Imagen de ${row.original.name}`}
					width={44}
					height={44}
					className='size-11 rounded-xl object-contain'
					sizes='44px'
					priority
				/>
			)
		},
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: () => <SortingButton field='name'>Nombre</SortingButton>,
		enableHiding: false,
	},
	// {
	// 	accessorKey: 'dni',
	// 	header: () => <SortingButton field='dni'>DNI</SortingButton>,
	// 	enableHiding: false,
	// },

	// {
	// 	accessorKey: 'genre',
	// 	header: () => <SortingButton field='genre'>Género</SortingButton>,
	// 	enableHiding: false,
	// },

	// {
	// 	accessorKey: 'age',
	// 	header: () => <SortingButton field='genre'>Edad</SortingButton>,
	// 	enableHiding: false,
	// },
	{
		accessorKey: 'licenseNumber',
		header: () => (
			<SortingButton field='licenseNumber'>N° de Licencia</SortingButton>
		),
		enableHiding: false,
	},

	{
		accessorKey: 'fleet',
		header: () => <SortingButton field='fleet.name'>Flota</SortingButton>,
		cell: ({ row }) => {
			const fleet = row.getValue<FleetModel>('fleet') || 'N/D'
			return fleet.name
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
					.writeText(record.licenseNumber)
					.then(() => {
						toast.info('N° de licencia copiado al portapapeles')
					})
					.catch(() => {
						toast.error('No se pudo copiar el n° de licencia del conductor')
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
							aria-label='Copiar número de licencia'
							onClick={handleCopy}>
							<ClipboardCopy className='mr-1 size-4' />
							Copiar licencia
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Modal
								title='Detalles del Conductor'
								description='Puedes editar estos campos desde el panel de edición.'
								triggerIcon={<ListCollapse className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Ver detalles de ${record.name}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Ver detalles'
								isReadonly>
								<Detail record={record} />
							</Modal>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Modal
								title='Editar Conductor'
								description='Modifica los datos del conductor. Ten en cuenta que algunos campos son opcionales.'
								triggerIcon={<Pencil className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Editar a ${record.name}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Editar'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPSERT_FORM_ID,
								}}>
								<span>@UpsertForm</span>
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
									'aria-label': `Eliminar al conductor ${record.name}`,
									'aria-disabled': 'false',
								}}
								cancelIcon={<CircleX className='mr-1 size-4' />}
								description={
									<>
										¿Estás seguro de que deseas eliminar a{' '}
										<b className='capitalize'>{record.name}</b>? Esta acción no
										se puede deshacer.
									</>
								}
								eraserButton={({ setOpen }) => (
									<EraserButton
										recordId={record.id}
										endpoint={ApiEndpoints.VEHICLES}
										setAlertOpen={setOpen}
										title='Conductores'
										description='Conductor eliminado correctamente.'
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
										'aria-label': `Eliminar imagen de ${record.name}`,
										'aria-disabled': 'false',
									}}
									cancelIcon={<CircleX className='mr-1 size-4' />}
									description={
										<>
											¿Estás seguro de que deseas remover la imagen del
											conductor <b className='capitalize'>{record.name}</b>?
											Esta acción no se puede deshacer.
										</>
									}
									eraserButton={({ setOpen }) => (
										<EraserButton
											recordId={record.id}
											endpoint={ApiEndpoints.FILES_DRIVERS}
											setAlertOpen={setOpen}
											title={`Conductor ${record.name}`}
											description='Imagen removida correctamente.'
										/>
									)}
								/>
							</DropdownMenuItem>
						) : (
							<Modal
								title={record.name}
								description='Sube una imagen del conductor. Ten en cuenta que la imagen debe cumplir lo siguiente: *.png, *.jpg archivos de hasta 10 MB con al menos 400px por 400px.'
								triggerIcon={<ImageUp className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Cargar imagen a ${record.name}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Cargar'
								isReadonly>
								<section className='px-4 pb-4 sm:px-0 sm:pb-0'>
									<ImageUpload
										recordId={record.id}
										endpoint={ApiEndpoints.FILES_DRIVERS}
										entity={`Conductor ${record.name}`}
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
