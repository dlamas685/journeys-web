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
import { FILTER_FORM_ID, PAGINATION_LIMITS_OPTIONS } from '@/common/constants'
import { ApiEndpoints, Pathnames, SortDirections } from '@/common/enums'
import { QueryParamsModel } from '@/common/models'
import DependenciesProvider from '@/common/providers/DependenciesProvider'
import { SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, SearchCheck } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DriverModel } from '../drivers/_models'
import { FleetModel } from '../fleets/_models'
import { findAllCostProfiles } from '../optimization/_actions/roadmaps.action'
import { VehicleModel } from '../vehicles/_models'
import columns from './_components/columns'
import FilterForm from './_components/filter-form'
import { COLUMN_LABELS } from './_constants'
import { RoadmapModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Hojas de Ruta',
	description:
		'Administra tus hojas de ruta creadas, cambia sus estados, elimina las que consideres innecesarias o modifica su alias.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function RoadmapsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: PAGINATION_LIMITS_OPTIONS[0],
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.ROADMAPS)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<RoadmapModel>(
		ApiEndpoints.ROADMAPS,
		queryParams,
		Pathnames.ROADMAPS
	)

	const fleets = await findAll<FleetModel>(
		ApiEndpoints.FLEETS,
		{},
		Pathnames.ROADMAPS
	).then(response => response.data.sort((a, b) => a.name.localeCompare(b.name)))

	const drivers = await findAll<DriverModel>(
		ApiEndpoints.DRIVERS,
		{},
		Pathnames.ROADMAPS
	).then(response => response.data.sort((a, b) => a.name.localeCompare(b.name)))

	const vehicles = await findAll<VehicleModel>(
		ApiEndpoints.VEHICLES,
		{},
		Pathnames.ROADMAPS
	).then(response =>
		response.data.sort((a, b) => a.licensePlate.localeCompare(b.licensePlate))
	)

	const costProfiles = await findAllCostProfiles(Pathnames.ROADMAPS)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Hojas de Ruta</FrameTitle>
			</FrameHeader>
			<FrameBody className='gap-2 sm:gap-4'>
				<DependenciesProvider
					dependencies={{
						costProfiles,
						fleets,
						drivers,
						vehicles,
					}}>
					<DataTableProvider
						data={response.data}
						columns={columns}
						metadata={response.meta}
						queryParams={queryParams}>
						<DataTableHeader>
							<DataTableSearch field='code' placeholder='Buscar por alias' />
							<DataTableToolbar className='row-start-1 justify-center sm:col-start-2'>
								<Button asChild>
									<Link
										href={Pathnames.OPTIMIZATION}
										aria-label='Crear una nueva hoja de ruta'>
										<CirclePlus className='mr-1 size-4' />
										Crear
									</Link>
								</Button>

								<Modal
									title='Configuración de Filtro'
									description='Completa los campos de acuerdo a tus preferencias para visualizar tus hojas de ruta.'
									triggerIcon={<Filter className='mr-1 size-4' />}
									triggerLabel='Filtro'
									triggerProps={{
										variant: 'outline',
									}}
									submitIcon={<SearchCheck className='mr-1 size-4' />}
									submitLabel='Aplicar'
									submitProps={{
										form: FILTER_FORM_ID,
									}}>
									<FilterForm
										queryParams={queryParams}
										fleets={fleets}
										drivers={drivers}
										vehicles={vehicles}
									/>
								</Modal>

								{hasFilters && (
									<Button variant='ghost' disabled={hasFilters} asChild>
										<Link
											href={{
												pathname: `${Pathnames.ROADMAPS}`,
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
								options={PAGINATION_LIMITS_OPTIONS}
								label='Número de hojas de ruta por página'
							/>
						</DataTableFooter>
					</DataTableProvider>
				</DependenciesProvider>
			</FrameBody>
		</Frame>
	)
}
