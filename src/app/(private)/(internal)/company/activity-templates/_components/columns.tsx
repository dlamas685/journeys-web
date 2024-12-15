'use client'
import SortingButton from '@/common/components/ui/data/client/sorting-button'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import type { ActivityTemplateModel } from '@/common/models'
import { calculateTotalTime } from '@/common/utils'
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
	CircleCheck,
	CircleX,
	ClipboardCopy,
	ListChecks,
	MoreHorizontal,
	Pencil,
	Save,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import UpsertForm from './upsert-form'

const columns: ColumnDef<ActivityTemplateModel>[] = [
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
		id: 'totalTime',
		header: 'Tiempo',
		cell: ({ row }) => {
			const activities = row.original.activities
			return activities ? calculateTotalTime(activities) : 'N/D'
		},
	},
	{
		id: 'totalActivities',
		header: 'Actividades',
		cell: ({ row }) => {
			const activities = row.original.activities
			return activities ? activities.length : 'N/D'
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
						toast.info('Nombre de la plantilla copiado al portapapeles')
					})
					.catch(() => {
						toast.error('No se pudo copiar el nombre de la plantilla')
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
							aria-label='Copiar nombre de la plantilla'
							onClick={handleCopy}>
							<ClipboardCopy className='mr-1 size-4' />
							Copiar nombre
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Modal
								title='Editar Plantilla de Actividades'
								description='Modifica los datos de la plantilla de actividades. Ten en cuenta que todos los campos son obligatorios.'
								triggerIcon={<Pencil className='mr-1 size-3.5' />}
								triggerProps={{
									type: 'button',
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Editar el registro ${record.name}`,
									'aria-disabled': false,
								}}
								triggerLabel='Editar'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPSERT_FORM_ID,
									'aria-label': `Guardar el registro ${record.name}`,
									'aria-disabled': false,
								}}>
								<UpsertForm record={record} />
							</Modal>
						</DropdownMenuItem>

						<DropdownMenuItem asChild>
							<RemovalAlert
								triggerLabel='Eliminar'
								triggerIcon={<Trash2 className='mr-1 size-3.5' />}
								triggerProps={{
									type: 'button',
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Eliminar el registro ${record.name}`,
									'aria-disabled': false,
								}}
								cancelIcon={<CircleX className='mr-1 size-4' />}
								description={
									<>
										¿Estás seguro de que deseas eliminar la plantilla de
										actividades <b className='capitalize'>{record.name}</b>?
										Esta acción no se puede deshacer.
									</>
								}
								eraserButton={({ setOpen }) => (
									<EraserButton
										recordId={record.id}
										endpoint={ApiEndpoints.ACTIVITY_TEMPLATES}
										setAlertOpen={setOpen}
										title='Plantilla de Actividades'
										description='Plantilla de actividades eliminada correctamente.'
										aria-label={`Confirmar eliminación de ${record.name}`}
										aria-disabled={false}
										type='button'
									/>
								)}
							/>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuLabel>Actividades</DropdownMenuLabel>

						<DropdownMenuItem asChild>
							<Link
								href={`${Pathnames.ACTIVITY_TEMPLATES}/${record.id}/${Pathnames.ACTIVITY_MANAGER}`}>
								<CircleCheck className='mr-1 size-3.5' />
								Gestionar
							</Link>
						</DropdownMenuItem>

						{record.activities && (
							<DropdownMenuItem asChild>
								<Modal
									title={`Actividades de ${record.name}`}
									description={
										<>
											Puedes agregar o quitar actividades de la plantilla desde
											el <b>gestor de actividades.</b>
										</>
									}
									triggerIcon={<ListChecks className='mr-1 size-3.5' />}
									triggerProps={{
										type: 'button',
										className:
											'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
										variant: 'ghost',
										'aria-label': `Ver todas las actividades de la plantilla ${record.name}`,
										'aria-disabled': false,
									}}
									triggerLabel='Ver detalle'
									isReadonly>
									<section className='flex flex-col gap-3 px-4 pb-3 sm:px-0 sm:pb-0'>
										<ul
											role='list'
											className='flex-grow list-image-checkmark space-y-2 pl-5 font-secondary text-muted-foreground'>
											{record.activities?.map((activity, index) => (
												<li key={index}>
													<p className='flex justify-between gap-4'>
														<span className='font-secondary text-sm capitalize'>
															{activity.name}
														</span>
														<span className='font-secondary text-sm'>
															{activity.duration} min
														</span>
													</p>
												</li>
											))}
										</ul>
										<p className='text-xs text-muted-foreground'>
											{calculateTotalTime(record.activities)}
											<br />
											{record.activities.length} actividades
										</p>
									</section>
								</Modal>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default columns
