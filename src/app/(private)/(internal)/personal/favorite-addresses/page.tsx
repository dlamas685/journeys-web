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
import FavoriteAddressGrid from './_components/favorite-address-grid'
import FilterForm from './_components/filter-form'
import UpsertForm from './_components/upsert-form'
import { FavoriteAddressModel } from './_models'

export const metadata: Metadata = {
	title: 'Journeys • Direcciones favoritas',
	description: 'Administra tus direcciones favoritas para tus optimizaciones.',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function FavoriteAddressesPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: 10,
		sorts: [{ field: 'alias', direction: SortDirections.ASC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(Pathnames.FAVORITE_ADDRESSES)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<FavoriteAddressModel>(
		ApiEndpoints.FAVORITE_ADDRESSES,
		queryParams,
		Pathnames.FAVORITE_ADDRESSES
	)

	const hasFilters =
		(queryParams.filters && queryParams.filters.length > 0) ||
		(queryParams.logicalFilters && queryParams.logicalFilters.length > 0)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Direcciones Favoritas</FrameTitle>
				<FrameGadgets>
					<Modal
						title='Nueva Dirección Favorita'
						description='Al agregar una dirección como favorita, podrás acceder a ella de forma rápida en tus optimizaciones. Ten en cuenta que todos los campos son obligatorios.'
						triggerIcon={<CirclePlus className='mr-1 size-4' />}
						triggerLabel='Agregar'
						triggerProps={{
							type: 'button',
							'aria-label': 'Agregar nueva dirección favorita',
							'aria-disabled': false,
						}}
						submitLabel='Guardar'
						submitIcon={<Save className='mr-1 size-4' />}
						submitProps={{
							form: UPSERT_FORM_ID,
							'aria-label': 'Guardar nueva dirección favorita',
							'aria-disabled': false,
						}}>
						<UpsertForm />
					</Modal>

					<Modal
						title='Configuración de Filtro'
						description='Completa los campos de acuerdo a tus preferencias para visualizar tus direcciones favoritas.'
						triggerIcon={<Filter className='mr-1 size-4' />}
						triggerLabel='Filtro'
						triggerProps={{
							type: 'button',
							variant: 'outline',
							'aria-label': 'Configurar filtro de direcciones favoritas',
							'aria-disabled': false,
						}}
						submitIcon={<SearchCheck className='mr-1 size-4' />}
						submitLabel='Aplicar'
						submitProps={{
							form: FILTER_FORM_ID,
							'aria-label': 'Aplicar filtro de direcciones favoritas',
							'aria-disabled': false,
						}}>
						<FilterForm queryParams={queryParams} />
					</Modal>

					{hasFilters && (
						<Button variant='ghost' asChild>
							<Link
								href={{
									pathname: `${Pathnames.FAVORITE_ADDRESSES}`,
									query: {
										query: jsonToBase64({
											...queryParams,
											filters: [],
										}),
									},
								}}
								aria-label='Limpiar filtro de direcciones favoritas'>
								<FilterX className='size-4' />
							</Link>
						</Button>
					)}
					<SortingButtons
						field='alias'
						label='alias'
						queryParams={queryParams}
					/>
				</FrameGadgets>
			</FrameHeader>
			<FrameBody className='items-center'>
				{response.data.length > 0 ? (
					<FavoriteAddressGrid
						defaultValue={response.data}
						page={response.meta.page}
						lastPage={response.meta.lastPage}
						total={response.meta.total}
						queryParams={queryParams}
					/>
				) : (
					<p className='text-center leading-[18.75rem] text-gray-400'>
						No se ha encontrado ninguna dirección favorita.
					</p>
				)}

				<ScrollToTopButton />
			</FrameBody>
		</Frame>
	)
}
