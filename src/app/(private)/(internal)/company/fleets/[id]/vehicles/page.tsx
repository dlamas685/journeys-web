import { findAll, findOne } from '@/common/actions/crud.action'
import { getServerUser } from '@/common/actions/session.action'
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
	DataTableRowsSelected,
	DataTableSearch,
	DataTableVisibilityColumns,
} from '@/common/components/ui/data/client/data-table'
import {
	DataTableBody,
	DataTableFooter,
	DataTableHeader,
	DataTableToolbar,
} from '@/common/components/ui/data/server/data-table'
import SeeMore from '@/common/components/ui/misc/see-more'
import Modal from '@/common/components/ui/overlay/modal'
import { UPDATE_FORM_ID } from '@/common/constants'
import {
	ApiEndpoints,
	FilterRules,
	FilterTypes,
	Pathnames,
	SortDirections,
} from '@/common/enums'
import { type QueryParamsModel } from '@/common/models'
import { Params, type SearchParams } from '@/common/types'
import { decodeQuery } from '@/common/utils'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { capitalCase } from 'change-case'
import { Link2, Save } from 'lucide-react'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { COLUMN_LABELS } from '../../../vehicles/_constants'
import { VehicleModel } from '../../../vehicles/_models'
import { FleetModel } from '../../_models'
import columns from './_components/columns'
import UpdateForm from './_components/vehicle-link-form'
import VehicleUnlink from './_components/vehicle-unlink'

type Props = {
	params: Promise<Params>
	searchParams: Promise<SearchParams>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params
	const fleetId = params['id']

	const fleet = await findOne<FleetModel>(ApiEndpoints.FLEETS, fleetId)

	return {
		title: `Journeys • Vehículos de ${capitalCase(fleet.name)}`,
		description: `Vincula y desvincula vehículos de la flota ${fleet.name}.`,
	}
}

export default async function FleetsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const encodedQuery = searchParams['query']
	const params = await props.params
	const fleetId = params['id']

	const paginationLimitsOptions = [4, 8, 16, 32, 64]

	const user = await getServerUser()

	const fallbackUrl = `${Pathnames.FLEETS}/${fleetId}/${Pathnames.VEHICLES}`

	let queryParams: QueryParamsModel = {
		page: 1,
		limit: paginationLimitsOptions[0],
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	if (encodedQuery) {
		const decodedQuery = decodeQuery(encodedQuery)

		if (!decodedQuery) redirect(fallbackUrl)

		queryParams = {
			...queryParams,
			...decodedQuery,
		}
	}

	const response = await findAll<VehicleModel>(
		ApiEndpoints.VEHICLES,
		{
			...queryParams,
			filters: [
				...(queryParams.filters ?? []),
				{
					field: 'fleetId',
					rule: FilterRules.EQUALS,
					type: FilterTypes.UUID,
					value: fleetId,
				},
			],
		},
		fallbackUrl
	)

	const fleet = await findOne<FleetModel>(ApiEndpoints.FLEETS, fleetId)

	const vehiclesWithoutFleets = await findAll<VehicleModel>(
		ApiEndpoints.VEHICLES,
		{
			filters: [
				{
					field: 'fleetId',
					rule: FilterRules.EQUALS,
					type: FilterTypes.UUID,
					value: 'null',
				},
			],
		},
		fallbackUrl
	).then(response =>
		response.data.sort((a, b) => a.licensePlate.localeCompare(b.licensePlate))
	)

	return (
		<Frame className='gap-5 sm:gap-4'>
			<FrameHeader className='sm:flex-col sm:gap-2'>
				<section className='flex flex-col'>
					<FrameTitle>Vehículos</FrameTitle>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href={`/${user?.userType?.toLocaleLowerCase()}/${Pathnames.FLEETS}`}>
									Flotas
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{capitalCase(fleet.name)}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</section>

				<SeeMore
					lines={2}
					className='font-secondary text-sm text-muted-foreground sm:text-base'>
					{fleet.description}
				</SeeMore>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-4'>
				<DataTableProvider
					data={response.data}
					columns={columns}
					metadata={response.meta}
					queryParams={queryParams}
					dependencies={{
						vehiclesWithoutFleets,
					}}>
					<DataTableHeader>
						<DataTableSearch
							field='licensePlate'
							placeholder='Buscar por número de patente'
						/>
						<DataTableToolbar className='row-start-1 justify-center sm:col-start-2'>
							<Modal
								title='Vincular Vehículo'
								description={
									vehiclesWithoutFleets.length > 0
										? 'Selecciona los vehículos que deseas vincular a esta flota.'
										: ' Todos los vehículos están vinculados con alguna flota crea nuevos vehículos o desvincula vehículos de otras flotas para poder vincularlos a esta'
								}
								triggerIcon={<Link2 className='mr-1 size-4' />}
								triggerLabel='Vincular'
								triggerProps={{
									disabled: fleet.maxVehicles <= response.meta.total,
								}}
								submitLabel='Guardar'
								submitIcon={<Save className='mr-1 size-4' />}
								submitProps={{
									form: UPDATE_FORM_ID,
								}}
								isReadonly={vehiclesWithoutFleets.length === 0}>
								{vehiclesWithoutFleets.length > 0 && (
									<UpdateForm fleetId={fleetId} />
								)}
							</Modal>
							<VehicleUnlink fleetId={fleetId} />
							<DataTableVisibilityColumns columnLabels={COLUMN_LABELS} />
						</DataTableToolbar>
					</DataTableHeader>
					<DataTableBody>
						<DataTable />
					</DataTableBody>
					<DataTableFooter className='sm:grid-cols-[1fr_auto_auto]'>
						<section className='flex flex-col'>
							<DataTablePaginationInfo />
							<DataTableRowsSelected />
						</section>
						<DataTablePagination advanced={response.meta.lastPage < 10} />
						<DataTablePaginationLimits
							className='justify-self-center'
							options={paginationLimitsOptions}
							label='Número de vehículos por página'
						/>
					</DataTableFooter>
				</DataTableProvider>
			</FrameBody>
		</Frame>
	)
}
