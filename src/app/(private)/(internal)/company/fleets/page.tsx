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
import {
	FILTER_FORM_ID,
	PAGINATION_LIMITS_OPTIONS,
	UPSERT_FORM_ID,
} from '@/common/constants'
import { ApiEndpoints, Pathnames, SortDirections } from '@/common/enums'
import { type QueryParamsModel } from '@/common/models'
import { type SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, Save, SearchCheck } from 'lucide-react'
import { type Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import columns from './_components/columns'
import FilterForm from './_components/filter-form'
import UpsertForm from './_components/upsert-form'
import { COLUMN_LABELS } from './_constants'
import { type FleetModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Flotas',
	description: 'Administra tus flotas para tus optimizaciones.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function FleetsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: PAGINATION_LIMITS_OPTIONS[0],
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.FLEETS)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<FleetModel>(
		ApiEndpoints.FLEETS,
		queryParams,
		Pathnames.FLEETS
	)
	console.log({ response })

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Flotas</FrameTitle>
			</FrameHeader>
			<FrameBody className='gap-2 sm:gap-4'>
				<DataTableProvider
					data={response.data}
					columns={columns}
					metadata={response.meta}
					queryParams={queryParams}>
					<DataTableHeader>
						<DataTableSearch field='name' placeholder='Buscar por nombre' />
						<DataTableToolbar className='row-start-1 justify-center sm:col-start-2'>
							<Modal
								title='Nueva Flota'
								description='Registra una nueva flota para usar en tus hojas de ruta. Ten en cuenta que algunos campos son opcionales.'
								triggerIcon={<CirclePlus className='mr-1 size-4' />}
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
								description='Completa los campos de acuerdo a tus preferencias para visualizar tus flotas.'
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
								<FilterForm queryParams={queryParams} />
							</Modal>

							{hasFilters && (
								<Button variant='ghost' disabled={hasFilters} asChild>
									<Link
										href={{
											pathname: `${Pathnames.FLEETS}`,
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
							label='Número de flotas por página'
						/>
					</DataTableFooter>
				</DataTableProvider>
			</FrameBody>
		</Frame>
	)
}
