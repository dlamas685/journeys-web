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
import { QueryParamsModel } from '@/common/models'
import { SearchParams } from '@/common/types'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { CirclePlus, Filter, FilterX, Save, SearchCheck } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import FavoritePlaceGrid from './_components/favorite-place-grid'
import FilterForm from './_components/filter-form'
import UpsertForm from './_components/upsert-form'
import { FavoritePlaceModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Lugares favoritos',
	description: 'Administra tus lugares favoritos para tus optimizaciones.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function FavoritePlacesPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: 10,
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.FAVORITE_PLACES)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<FavoritePlaceModel>(
		ApiEndpoints.FAVORITE_PLACES,
		queryParams,
		Pathnames.FAVORITE_PLACES
	)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Lugares Favoritos</FrameTitle>
				<FrameGadgets>
					<Modal
						title='Nuevo Lugar Favorito'
						description='Al agregar un lugar como favorito, podrás acceder a el de forma rápida en tus optimizaciones.'
						triggerIcon={<CirclePlus className='mr-1 size-4' />}
						triggerLabel='Agregar'
						submitLabel='Guardar'
						submitIcon={<Save className='mr-1 size-4' />}
						submitProps={{
							form: UPSERT_FORM_ID,
						}}>
						<UpsertForm />
					</Modal>

					<Modal
						title='Configuración de Filtro'
						description='Completa los campos de acuerdo a tus preferencias para visualizar tus lugares favoritos.'
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
						<Button variant='ghost' asChild>
							<Link
								href={{
									pathname: `${Pathnames.FAVORITE_PLACES}`,
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
					<SortingButtons
						field='createdAt'
						label='fecha de creación'
						queryParams={queryParams}
					/>
				</FrameGadgets>
			</FrameHeader>
			<FrameBody className='items-center'>
				{response.data.length > 0 ? (
					<FavoritePlaceGrid
						defaultValue={response.data}
						page={response.meta.page}
						lastPage={response.meta.lastPage}
						total={response.meta.total}
						queryParams={queryParams}
					/>
				) : (
					<p className='text-center leading-[18.75rem] text-gray-400'>
						No ha agregado ningún lugar favorito
					</p>
				)}
			</FrameBody>
		</Frame>
	)
}
