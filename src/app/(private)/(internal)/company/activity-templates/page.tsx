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
import { ActivityTemplateModel, type QueryParamsModel } from '@/common/models'
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
import { COLUMN_LABELS, OTHER_COLUMN_LABELS } from './_constants'

export const metadata: Metadata = {
	title: 'Journeys • Plantillas de Actividades',
	description:
		'Administra tus plantillas de actividades para acceder a ellas de forma rápida en tus optimizaciones.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function ActivityTemplatesPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: PAGINATION_LIMITS_OPTIONS[0],
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

	const response = await findAll<ActivityTemplateModel>(
		ApiEndpoints.ACTIVITY_TEMPLATES,
		queryParams,
		Pathnames.ACTIVITY_TEMPLATES
	)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame className='gap-5 sm:gap-3'>
			<FrameHeader>
				<FrameTitle>Plantillas de Actividades</FrameTitle>
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
								title='Nueva Plantilla de Actividades'
								description='Al crear una plantilla de actividades, podrás utilizarla fácilmente para optimizar tus hojas de ruta. Recuerda que todos los campos son obligatorios.'
								triggerIcon={<CirclePlus className='mr-1 size-4' />}
								triggerProps={{
									type: 'button',
									'aria-label': 'Crear nueva plantilla de actividades',
									'aria-disabled': false,
								}}
								triggerLabel='Crear'
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									type: 'submit',
									form: UPSERT_FORM_ID,
									'aria-label': 'Guardar nueva plantilla de actividades',
									'aria-disabled': false,
								}}>
								<UpsertForm />
							</Modal>
							<Modal
								title='Configuración de Filtro'
								description='Completa los campos de acuerdo a tus preferencias para visualizar tus plantillas de actividades.'
								triggerIcon={<Filter className='mr-1 size-4' />}
								triggerLabel='Filtro'
								triggerProps={{
									type: 'button',
									variant: 'outline',
									'aria-label': 'Configurar filtro',
									'aria-disabled': false,
								}}
								submitIcon={<SearchCheck className='mr-1 size-4' />}
								submitLabel='Aplicar'
								submitProps={{
									type: 'submit',
									form: FILTER_FORM_ID,
									'aria-label': 'Aplicar filtro',
									'aria-disabled': false,
								}}>
								<FilterForm queryParams={queryParams} />
							</Modal>

							{hasFilters && (
								<Button variant='ghost' disabled={hasFilters} asChild>
									<Link
										aria-label='Limpiar filtro'
										prefetch
										href={{
											pathname: `${Pathnames.ACTIVITY_TEMPLATES}`,
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
							<DataTableVisibilityColumns
								columnLabels={{ ...COLUMN_LABELS, ...OTHER_COLUMN_LABELS }}
							/>
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
							label='Número de plantillas por página'
						/>
					</DataTableFooter>
				</DataTableProvider>
			</FrameBody>
		</Frame>
	)
}
