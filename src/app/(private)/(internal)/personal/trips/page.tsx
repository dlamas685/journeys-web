import { findAll } from '@/common/actions/crud.action'
import {
	Frame,
	FrameBody,
	FrameGadgets,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import ScrollToTopButton from '@/common/components/ui/misc/scroll-top'
import SortingButtons from '@/common/components/ui/misc/sorting-buttons'
import Modal from '@/common/components/ui/overlay/modal'
import { FILTER_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames, SortDirections } from '@/common/enums'
import { QueryParamsModel } from '@/common/models'
import { SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, SearchCheck } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import FilterForm from './_components/filter-form'
import TripsGrid from './_components/trips-grid'
import { TripModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Viajes',
	description:
		'Visualiza tus viajes, sus detalles y gestiona el estado de cada uno.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function TripsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: 10,
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.TRIPS)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<TripModel>(
		ApiEndpoints.TRIPS,
		queryParams,
		Pathnames.TRIPS
	)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Viajes</FrameTitle>
				<FrameGadgets>
					<Button asChild>
						<Link
							href={Pathnames.OPTIMIZATION}
							aria-label='Crear un nuevo viaje'>
							<CirclePlus className='mr-1 size-4' />
							Crear
						</Link>
					</Button>
					<Modal
						title='Configuración de Filtro'
						description='Completa los campos de acuerdo a tus preferencias para visualizar tus viajes.'
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
									pathname: `${Pathnames.TRIPS}`,
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
						field='createdAt'
						label='fecha de creación'
						queryParams={queryParams}
					/>
				</FrameGadgets>
			</FrameHeader>
			<FrameBody>
				{response.data.length > 0 ? (
					<TripsGrid
						defaultValue={response.data}
						page={response.meta.page}
						lastPage={response.meta.lastPage}
						total={response.meta.total}
						queryParams={queryParams}
					/>
				) : (
					<p className='text-center leading-[18.75rem] text-gray-400'>
						No se ha encontrado ningún viaje.
					</p>
				)}

				<ScrollToTopButton />
			</FrameBody>
		</Frame>
	)
}
