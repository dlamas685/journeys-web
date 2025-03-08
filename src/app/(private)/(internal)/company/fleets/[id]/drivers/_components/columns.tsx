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
import Detail from '../../../../drivers/_components/detail'
import { DriverModel } from '../../../../drivers/_models'

const columns: ColumnDef<DriverModel>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Seleccionar todos los conductores en la página'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label={`Seleccionar al conductor ${row.original.name}`}
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
	{
		accessorKey: 'licenseNumber',
		header: () => (
			<SortingButton field='licenseNumber'>N° de Licencia</SortingButton>
		),
		enableHiding: false,
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
							aria-label='Copiar patente'
							onClick={handleCopy}>
							<ClipboardCopy className='mr-1 size-4' />
							Copiar n° de Licencia
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Modal
								title='Detalles del Conductor'
								description='Puedes editar estos campos desde el panel de edición en la sección Conductores.'
								triggerIcon={<ListCollapse className='mr-1 size-3.5' />}
								triggerProps={{
									className:
										'w-full font-normal h-auto justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary',
									variant: 'ghost',
									'aria-label': `Detalles del conductor ${record.name}`,
									'aria-disabled': 'false',
								}}
								triggerLabel='Detalles'
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
