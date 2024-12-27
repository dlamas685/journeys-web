import { findAll } from '@/common/actions/crud.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import {
	DataTable,
	DataTablePagination,
	DataTablePaginationInfo,
	DataTablePaginationLimits,
	DataTableProvider,
	DataTableSearch,
	DataTableVisibilityColumns,
} from '@/common/components/ui/data/client/data-table'
import {
	DataTableBody,
	DataTableFooter,
	DataTableHeader,
	DataTableToolbar,
} from '@/common/components/ui/data/server/data-table'
import Modal from '@/common/components/ui/overlay/modal'
import { FILTER_FORM_ID, UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames, SortDirections } from '@/common/enums'
import { type QueryParamsModel } from '@/common/models'
import { type SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, Save, SearchCheck } from 'lucide-react'
import { type Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FleetModel } from '../fleets/_models'
import columns from './_components/columns'
import FilterForm from './_components/filter-form'
import UpsertForm from './_components/upsert-form'
import { COLUMN_LABELS } from './_constants'
import { type VehicleModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Vehículos',
	description:
		'Administra tus vehículos para usar en tus flotas y hojas de ruta.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function FleetsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: 5,
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.VEHICLES)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<VehicleModel>(
		ApiEndpoints.VEHICLES,
		queryParams,
		Pathnames.VEHICLES
	)

	const fleets = await findAll<FleetModel>(
		ApiEndpoints.FLEETS,
		{},
		Pathnames.FLEETS
	).then(response => response.data.sort((a, b) => a.name.localeCompare(b.name)))

	const underAllocatedFleets = fleets.filter(
		fleet => fleet.maxVehicles < fleet.vehicles.length
	)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame className='gap-5 sm:gap-3'>
			<FrameHeader>
				<FrameTitle>Vehículos</FrameTitle>
			</FrameHeader>
			<FrameBody className='gap-2 sm:gap-4'>
				<DataTableProvider
					data={response.data}
					columns={columns}
					metadata={response.meta}
					dependencies={{
						fleets: underAllocatedFleets,
					}}
					queryParams={queryParams}>
					<DataTableHeader>
						<DataTableSearch
							field='licensePlate'
							placeholder='Buscar por patente'
						/>
						<DataTableToolbar className='row-start-1 justify-center sm:col-start-2'>
							<Modal
								title='Nuevo vehículo'
								description='Registra un nuevo vehículo para usar en tus hojas de ruta. Ten en cuenta que algunos campos son opcionales.'
								triggerIcon={<CirclePlus className='mr-1 size-4' />}
								triggerProps={{
									'aria-label': 'Crear nuevo vehículo',
									'aria-disabled': false,
								}}
								triggerLabel='Crear'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPSERT_FORM_ID,
								}}>
								<UpsertForm />
							</Modal>
							<Modal
								title='Configuración de Filtro'
								description='Completa los campos de acuerdo a tus preferencias para visualizar tus vehículos.'
								triggerIcon={<Filter className='mr-1 size-4' />}
								triggerLabel='Filtro'
								triggerProps={{
									variant: 'outline',
									'aria-label': 'Configurar filtro',
									'aria-disabled': false,
								}}
								submitIcon={<SearchCheck className='mr-1 size-4' />}
								submitLabel='Aplicar'
								submitProps={{
									form: FILTER_FORM_ID,
								}}>
								<FilterForm queryParams={queryParams} fleets={fleets} />
							</Modal>

							{hasFilters && (
								<Button variant='ghost' disabled={hasFilters} asChild>
									<Link
										aria-label='Limpiar filtro'
										prefetch
										href={{
											pathname: `${Pathnames.VEHICLES}`,
											query: {
												query: jsonToBase64({
													...queryParams,
													filters: [],
												}),
											},
										}}>
										<FilterX className='size-4' />
									</Link>
								</Button>
							)}
							<DataTableVisibilityColumns columnLabels={COLUMN_LABELS} />
						</DataTableToolbar>
					</DataTableHeader>
					<DataTableBody>
						<DataTable />
					</DataTableBody>
					<DataTableFooter className='sm:grid-cols-[1fr_auto_auto]'>
						<DataTablePaginationInfo />
						<DataTablePagination advanced={response.meta.lastPage < 10} />
						<DataTablePaginationLimits
							className='justify-self-center'
							options={[5, 10, 25, 50, 100]}
							label='Número de vehículos por página'
						/>
					</DataTableFooter>
				</DataTableProvider>
			</FrameBody>
		</Frame>
	)
}
