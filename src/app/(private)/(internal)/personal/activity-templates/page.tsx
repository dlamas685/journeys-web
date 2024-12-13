import { findAll } from '@/common/actions/crud.action'
import {
	Frame,
	FrameBody,
	FrameGadgets,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import SortingButtons from '@/common/components/ui/misc/sorting-buttons'
import Modal from '@/common/components/ui/overlay/modal'
import { FILTER_FORM_ID, UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames, SortDirections } from '@/common/enums'
import type { ActivityTemplateModel, QueryParamsModel } from '@/common/models'
import type { SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, Save, SearchCheck } from 'lucide-react'
import { type Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ActivitiesTemplateGrid from './_components/activity-template-grid'
import FilterForm from './_components/filter-form'

export const metadata: Metadata = {
	title: 'Journeys • Plantillas de actividades',
	description:
		'Administra tus plantillas de actividades para tus optimizaciones.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function ActivitiesTemplatesPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: 10,
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.ACTIVITY_TEMPLATES)

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
		<Frame>
			<FrameHeader>
				<FrameTitle>Plantilla de actividades</FrameTitle>
				<FrameGadgets>
					<Modal
						title='Nueva Plantilla de Actividades'
						description='Al agregar una plantilla de actividades, podrás acceder a ella de forma rápida en tus optimizaciones. Ten en cuenta que todos los campos son obligatorios.'
						triggerIcon={<CirclePlus className='mr-1 size-4' />}
						triggerLabel='Crear'
						triggerProps={{
							type: 'button',
							'aria-label': 'Crear nueva plantilla de actividades',
							'aria-disabled': false,
						}}
						submitLabel='Guardar'
						submitIcon={<Save className='mr-1 size-4' />}
						submitProps={{
							form: UPSERT_FORM_ID,
							type: 'submit',
							'aria-label': 'Guardar nueva plantilla de actividades',
							'aria-disabled': false,
						}}>
						<span>@UpsertForm</span>
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
						<Button variant='ghost' asChild>
							<Link
								href={{
									pathname: `${Pathnames.ACTIVITY_TEMPLATES}`,
									query: {
										query: jsonToBase64({
											...queryParams,
											filters: [],
										}),
									},
								}}
								aria-label='Limpiar filtro'>
								<FilterX className='size-4' />
							</Link>
						</Button>
					)}
					<SortingButtons
						field='name'
						label='nombre'
						queryParams={queryParams}
					/>
				</FrameGadgets>
			</FrameHeader>
			<FrameBody className='items-center'>
				{response.data.length > 0 ? (
					<ActivitiesTemplateGrid
						defaultValue={response.data}
						page={response.meta.page}
						lastPage={response.meta.lastPage}
						total={response.meta.total}
						queryParams={queryParams}
					/>
				) : (
					<p className='text-center leading-[18.75rem] text-gray-400'>
						No ha agregado ninguna plantilla de actividades.
					</p>
				)}
			</FrameBody>
		</Frame>
	)
}
