'use client'

import { findAll } from '@/common/actions/crud.action'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { ActivityModel, ActivityTemplateModel } from '@/common/models'
import { useLoading } from '@/common/stores/loading.store'
import { formatTime, sleep } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { CheckCircle2, LoaderCircle, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import columns from './columns'

type Props = {
	onReady?: (selected: ActivityModel[]) => void
}

const ServicesSetting = ({ onReady }: Readonly<Props>) => {
	const isDesktop = useMediaQuery('(min-width: 640px)')

	const isLoading = useLoading(state => state.loading)

	const setIsLoading = useLoading(state => state.setLoading)

	const [template, setTemplate] = useState<string>('')

	const [open, setOpen] = useState<boolean>(false)

	const [activityTemplates, setActivityTemplates] = useState<
		ActivityTemplateModel[]
	>([])

	const [activities, setActivities] = useState<ActivityModel[]>([])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [rowSelection, setRowSelection] = useState({})

	const [checkboxesSelected, setCheckBoxesSelected] = useState<ActivityModel[]>(
		[]
	)

	const table = useReactTable({
		data: activities,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			columnFilters,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 3,
			},
		},
	})

	const handleTemplate = (value: string) => {
		const selectedTemplate = activityTemplates.find(
			activityTemplate => activityTemplate.id === value
		)

		if (selectedTemplate) {
			setTemplate(selectedTemplate.id)
			setActivities(selectedTemplate.activities!)
		}
	}

	const handleReady = async () => {
		setIsLoading(true)

		const selected = isDesktop
			? table.getFilteredSelectedRowModel().rows.map(row => row.original)
			: checkboxesSelected

		await sleep(1000)
			.then(() => {
				onReady?.(selected)
				handleReset()
				setOpen(false)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			handleReset()
		}

		setOpen(open)
	}

	const handleReset = () => {
		table.setRowSelection({})
		setCheckBoxesSelected([])
		setTemplate(activityTemplates[0].id)
		setActivities(activityTemplates[0].activities!)
	}

	useEffect(() => {
		const fetchActivityTemplates = async () => {
			const response = await findAll<ActivityTemplateModel>(
				ApiEndpoints.ACTIVITY_TEMPLATES,
				{},
				Pathnames.ROADMAPS
			)

			const templatesWithActivities = response.data.filter(
				activityTemplate => activityTemplate.activities?.length !== 0
			)

			if (templatesWithActivities.length > 0) {
				setActivityTemplates(templatesWithActivities)
				setTemplate(templatesWithActivities[0].id)
				setActivities(templatesWithActivities[0].activities!)
			}
		}

		fetchActivityTemplates()
	}, [])

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button
						variant='secondary'
						className='font-normal text-muted-foreground'>
						<PlusCircle className='mr-1 size-4' />
						Agregar
					</Button>
				</DialogTrigger>
				<DialogContent className='max-w-xl'>
					<DialogHeader>
						<DialogTitle>Actividades</DialogTitle>
						<DialogDescription>
							Selecciona las actividades que se realizaran como servicio a
							domicilio. Recuerda que en este contexto una actividad corresponde
							a un servicio.
						</DialogDescription>
					</DialogHeader>
					<section className='flex flex-col gap-2'>
						<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
							<h3 className='font-medium text-foreground'>Plantillas</h3>

							<RadioGroup
								defaultValue={undefined}
								value={template}
								onValueChange={handleTemplate}
								className='max-h-36 overflow-auto'>
								{activityTemplates.map(activityTemplate => (
									<div
										key={activityTemplate.id}
										className='flex items-center space-x-2'>
										<RadioGroupItem
											value={activityTemplate.id}
											id={activityTemplate.id}
										/>
										<Label htmlFor={activityTemplate.id}>
											{activityTemplate.name}
										</Label>
									</div>
								))}
							</RadioGroup>
						</section>
						<section className='flex flex-col gap-4'>
							<Input
								placeholder='Escribe el nombre o duración'
								value={
									(table.getColumn('name')?.getFilterValue() as string) ?? ''
								}
								onChange={event => {
									table.getColumn('name')?.setFilterValue(event.target.value)
								}}
								className='max-w-xs'
							/>

							<section className='rounded-md border font-secondary text-muted-foreground'>
								<Table>
									<TableHeader>
										{table.getHeaderGroups().map(headerGroup => (
											<TableRow
												key={headerGroup.id}
												className='hover:bg-inherit'>
												{headerGroup.headers.map(header => {
													return (
														<TableHead key={header.id}>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																	)}
														</TableHead>
													)
												})}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows?.length ? (
											table.getRowModel().rows.map(row => (
												<TableRow
													key={row.id}
													className='cursor-default'
													data-state={row.getIsSelected() && 'selected'}>
													{row.getVisibleCells().map(cell => (
														<TableCell key={cell.id}>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext()
															)}
														</TableCell>
													))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className='h-24 text-center'>
													No se encontraron resultados.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>

								<section className='flex justify-between px-3 py-4'>
									<p className='flex-1 text-sm text-muted-foreground'>
										{table.getFilteredSelectedRowModel().rows.length} de{' '}
										{table.getFilteredRowModel().rows.length} fila(s)
										seleccionadas.
									</p>
									<section className='flex items-center justify-end space-x-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => table.previousPage()}
											disabled={!table.getCanPreviousPage()}>
											Anterior
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() => table.nextPage()}
											disabled={!table.getCanNextPage()}>
											Siguiente
										</Button>
									</section>
								</section>
							</section>
						</section>
					</section>
					<DialogFooter>
						<Button type='button' onClick={handleReady}>
							{isLoading ? (
								<LoaderCircle className='mr-1 size-4 animate-spin' />
							) : (
								<CheckCircle2 className='mr-1 size-4' />
							)}
							Listo
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>
				<Button
					variant='secondary'
					className='font-normal text-muted-foreground'>
					<PlusCircle className='mr-1 size-4' />
					Agregar
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>Actividades</DrawerTitle>
					<DrawerDescription>
						Selecciona las actividades que se realizaran como servicio a
						domicilio. Recuerda que en este contexto una actividad corresponde a
						un servicio.
					</DrawerDescription>
				</DrawerHeader>
				<section className='flex max-h-96 flex-col gap-4 overflow-auto px-4'>
					<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
						<h3 className='font-medium text-foreground'>Plantillas</h3>

						<RadioGroup
							defaultValue={undefined}
							value={template}
							onValueChange={handleTemplate}>
							{activityTemplates.map(activityTemplate => (
								<div
									key={activityTemplate.id}
									className='flex items-center space-x-2'>
									<RadioGroupItem
										value={activityTemplate.id}
										id={activityTemplate.id}
									/>
									<Label htmlFor={activityTemplate.id}>
										{activityTemplate.name}
									</Label>
								</div>
							))}
						</RadioGroup>
					</section>
					<section className='flex flex-col gap-3'>
						{activities.map(activity => (
							<div key={activity.id} className='items-top flex space-x-2'>
								<Checkbox
									id={activity.id}
									onClick={() => {
										setCheckBoxesSelected([...checkboxesSelected, activity])
									}}
								/>
								<div className='grid leading-none text-muted-foreground'>
									<label
										htmlFor={activity.id}
										className='flex justify-between text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
										{activity.name}{' '}
										<span className='text-sm font-normal text-muted-foreground'>
											{activity.duration
												? formatTime(activity.duration)
												: 'N/D'}
										</span>
									</label>
									<p className='text-sm'>
										<span>{activity.description}</span>
									</p>
								</div>
							</div>
						))}
					</section>
				</section>
				<DrawerFooter>
					<Button type='button' onClick={handleReady}>
						{isLoading ? (
							<LoaderCircle className='mr-1 size-4 animate-spin' />
						) : (
							<CheckCircle2 className='mr-1 size-4' />
						)}
						Listo
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default ServicesSetting
