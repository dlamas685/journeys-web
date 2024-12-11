'use client'
import { DataTableContext } from '@/common/contexts/data-table-context'
import { FilterRules, FilterTypes } from '@/common/enums'
import { useDataTableContext } from '@/common/hooks/use-data-table-context'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import type {
	FilterFieldModel,
	PaginationMetadataModel,
	QueryParamsModel,
} from '@/common/models'
import { jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
	type ColumnDef,
	type RowSelectionState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Settings2,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import {
	type ChangeEvent,
	type ComponentProps,
	type ReactNode,
	useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'

type DataTableProviderProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	metadata: PaginationMetadataModel
	queryParams: QueryParamsModel
	children: ReactNode
	dependencies?: Record<string, object[]>
}

const DataTableProvider = <TData, TValue>({
	columns,
	data,
	metadata,
	queryParams,
	children,
	dependencies,
}: Readonly<DataTableProviderProps<TData, TValue>>) => {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		rowCount: metadata.total,
		state: {
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<DataTableContext.Provider
			value={{
				table,
				columnVisibility,
				setColumnVisibility,
				rowSelection,
				setRowSelection,
				columns,
				queryParams,
				metadata,
				dependencies,
			}}>
			{children}
		</DataTableContext.Provider>
	)
}

const DataTable = <TData, TValue>() => {
	const { table, columns } = useDataTableContext<TData, TValue>()

	return (
		<Table className='border-separate border-spacing-y-3 font-secondary'>
			<TableHeader>
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow
						key={headerGroup.id}
						className='border-none hover:bg-inherit'>
						{headerGroup.headers.map(header => {
							return (
								<TableHead className='text-black' key={header.id}>
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
							className='rounded-l-xl rounded-r-xl border-none bg-zinc-50 hover:bg-orange-50 hover:text-orange-500'
							data-state={row.getIsSelected() && 'selected'}>
							{row.getVisibleCells().map((cell, index) => (
								<TableCell
									key={cell.id}
									className={cn('text-sm', {
										'rounded-l-xl': index === 0,
										'rounded-r-xl': index === row.getVisibleCells().length - 1,
									})}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className='h-24 text-center'>
							No hay resultados.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

type DataTableVisibilityColumnsProps = ComponentProps<typeof Button> & {
	label?: string
	icon?: ReactNode
	columnLabels: Record<string, string>
}

const DataTableVisibilityColumns = <TData, TValue>({
	label = 'Columnas',
	icon,
	columnLabels,
	className,
	...rest
}: DataTableVisibilityColumnsProps) => {
	const { table } = useDataTableContext<TData, TValue>()
	const isDesktop = useMediaQuery('(min-width: 640px)')
	const [open, setOpen] = useState<boolean>(false)

	if (isDesktop) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type='button'
						aria-disabled={false}
						aria-label='Configuración de columnas'
						variant='outline'
						className={cn('justify-self-end', className)}
						{...rest}>
						{icon ?? <Settings2 className='mr-1 size-4' />} {label}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{table
						.getAllColumns()
						.filter(column => column.getCanHide())
						.map(column => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={column.getIsVisible()}
									onCheckedChange={value => column.toggleVisibility(!!value)}>
									{columnLabels[column.id] ?? column.id}
								</DropdownMenuCheckboxItem>
							)
						})}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant='outline'
					type='button'
					aria-disabled={false}
					aria-label='Configuración de columnas'
					className={cn('justify-self-end', className)}
					{...rest}>
					{icon ?? <Settings2 className='mr-1 size-4' />} {label}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>{label}</DrawerTitle>
					<DrawerDescription>
						Selecciona las columnas que deseas visualizar.
					</DrawerDescription>
				</DrawerHeader>
				<ul className='flex flex-col gap-3 px-4 pb-4'>
					{table
						.getAllColumns()
						.filter(column => column.getCanHide())
						.map(column => {
							return (
								<li key={column.id} className='flex items-center space-x-2'>
									<Checkbox
										aria-label='Seleccionar columna'
										name={column.id}
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									/>
									<label
										aria-label={columnLabels[column.id] ?? column.id}
										htmlFor={column.id}
										className='text-sm font-medium'>
										{columnLabels[column.id] ?? column.id}
									</label>
								</li>
							)
						})}
				</ul>
			</DrawerContent>
		</Drawer>
	)
}

type DataTableSearchProps = ComponentProps<typeof Input> & {
	field: string
}

const DataTableSearch = <TData, TValue>({
	field,
	className,
	...rest
}: Readonly<DataTableSearchProps>) => {
	const { queryParams } = useDataTableContext<TData, TValue>()

	const pathname = usePathname()

	const router = useRouter()

	const [value, setValue] = useState<string>(
		queryParams.filters?.find(filter => filter.field === field)?.value
	)

	const handleSearch = useDebouncedCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target

			if (!value || value.trim().length === 0) {
				return router.replace(pathname)
			}

			const filter: FilterFieldModel = {
				field,
				rule: FilterRules.CONTAINS,
				type: FilterTypes.STRING,
				value,
			}

			const newQueryParams = {
				...queryParams,
				page: 1,
				filters: queryParams.filters
					? [...queryParams.filters, filter]
					: [filter],
			}
			const query = jsonToBase64(newQueryParams)

			router.replace(`${pathname}?query=${query}`)
		},
		300
	)

	return (
		<Input
			muted={false}
			placeholder='Buscar...'
			value={value}
			className={cn('rounded-lg', className)}
			onChange={handleSearch}
			{...rest}
		/>
	)
}

type DataTablePaginationProps = {
	advanced?: boolean
}

const DataTablePagination = <TData, TValue>({
	advanced,
}: Readonly<DataTablePaginationProps>) => {
	const { metadata, queryParams } = useDataTableContext<TData, TValue>()

	if (advanced) {
		return (
			<Pagination className='items-center justify-center sm:justify-end'>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink
							aria-label='Ir a la primera página'
							href={{
								query: {
									query: jsonToBase64({
										...queryParams,
										page: 1,
									}),
								},
							}}
							disabled={metadata.page === 1}
							aria-disabled={metadata.page === 1}>
							<ChevronsLeft className='size-4' />
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink
							aria-label='Ir a la página anterior'
							href={{
								query: {
									query: jsonToBase64({
										...queryParams,
										page: metadata.page - 1,
									}),
								},
							}}
							disabled={metadata.page === 1}
							aria-disabled={metadata.page === 1}>
							<ChevronLeft className='size-4' />
						</PaginationLink>
					</PaginationItem>
					{metadata.lastPage > 1 &&
						Array.from(
							{ length: metadata.lastPage },
							(_, index) => index + 1
						).map(page => (
							<PaginationItem key={page}>
								<PaginationLink
									aria-label={`Ir a la página ${page}`}
									href={{
										query: {
											query: jsonToBase64({
												...queryParams,
												page,
											}),
										},
									}}
									isActive={metadata.page === page}>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

					<PaginationItem>
						<PaginationLink
							aria-label='Ir a la página siguiente'
							href={{
								query: {
									query: jsonToBase64({
										...queryParams,
										page: metadata.page + 1,
									}),
								},
							}}
							aria-disabled={metadata.page === metadata.lastPage}
							disabled={metadata.page === metadata.lastPage}>
							<ChevronRight className='size-4' />
						</PaginationLink>
					</PaginationItem>

					<PaginationItem>
						<PaginationLink
							aria-label='Ir a la última página'
							href={{
								query: {
									query: jsonToBase64({
										...queryParams,
										page: metadata.lastPage,
									}),
								},
							}}
							disabled={metadata.page === metadata.lastPage}
							aria-disabled={metadata.page === metadata.lastPage}>
							<ChevronsRight className='size-4' />
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		)
	}

	return (
		<Pagination className='items-center justify-center sm:justify-end'>
			<PaginationContent>
				<PaginationItem>
					<PaginationLink
						aria-label='Ir a la primera página'
						href={{
							query: {
								query: jsonToBase64({
									...queryParams,
									page: 1,
								}),
							},
						}}
						disabled={metadata.page === 1}
						aria-disabled={metadata.page === 1}>
						<ChevronsLeft className='size-4' />
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink
						aria-label='Ir a la página anterior'
						href={{
							query: {
								query: jsonToBase64({
									...queryParams,
									page: metadata.page - 1,
								}),
							},
						}}
						aria-disabled={metadata.page === 1}
						disabled={metadata.page === 1}>
						<ChevronLeft className='size-4' />
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						aria-label='Ir a la página siguiente'
						href={{
							query: {
								query: jsonToBase64({
									...queryParams,
									page: metadata.page + 1,
								}),
							},
						}}
						aria-disabled={metadata.page === metadata.lastPage}
						disabled={metadata.page === metadata.lastPage}>
						<ChevronRight className='size-4' />
					</PaginationLink>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						aria-label='Ir a la última página'
						href={{
							query: {
								query: jsonToBase64({
									...queryParams,
									page: metadata.lastPage,
								}),
							},
						}}
						aria-disabled={metadata.page === metadata.lastPage}
						disabled={metadata.page === metadata.lastPage}>
						<ChevronsRight className='size-4' />
					</PaginationLink>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}

type DataTablePaginationInfoProps = ComponentProps<'p'> & {}

const DataTablePaginationInfo = <TData, TValue>({
	className,
	...rest
}: Readonly<DataTablePaginationInfoProps>) => {
	const { metadata } = useDataTableContext<TData, TValue>()

	return (
		<p
			className={cn(
				'text-center font-secondary text-sm sm:text-left',
				className
			)}
			{...rest}>
			{metadata.total} resultados - Página {metadata.page} de{' '}
			{metadata.lastPage}
		</p>
	)
}

type DataTablePaginationLimits = ComponentProps<'section'> & {
	label?: string
	icon?: ReactNode
	options: number[]
}

const DataTablePaginationLimits = <TData, TValue>({
	className,
	label,
	options,
	...rest
}: Readonly<DataTablePaginationLimits>) => {
	const { queryParams } = useDataTableContext<TData, TValue>()
	const router = useRouter()
	const pathname = usePathname()

	const handleLimit = (value: string) => {
		const newQueryParams = {
			...queryParams,
			page: 1,
			limit: Number(value),
		}
		const query = jsonToBase64(newQueryParams)

		router.replace(`${pathname}?query=${query}`)
	}

	return (
		<section className={cn('flex items-center gap-2', className)} {...rest}>
			{label && <p className='text-sm sm:hidden'>{label}:</p>}
			<Select
				onValueChange={value => handleLimit(value)}
				defaultValue={queryParams.limit?.toString()}>
				<SelectTrigger
					aria-label='Número de registros por página'
					muted={false}
					className='w-auto p-4'>
					<SelectValue placeholder={queryParams.limit} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{options.map(option => (
							<SelectItem
								aria-label={`Mostrar ${option} resultados por página`}
								key={option}
								value={option.toString()}>
								{option}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</section>
	)
}

export {
	DataTable,
	DataTablePagination,
	DataTablePaginationInfo,
	DataTablePaginationLimits,
	DataTableProvider,
	DataTableSearch,
	DataTableVisibilityColumns,
}
