import { findOne } from '@/common/actions/crud.action'
import { getServerUser } from '@/common/actions/session.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { Params } from '@/common/types'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { capitalCase } from 'change-case'
import { Metadata } from 'next'
import { TripModel } from '../_models'
import Results from './_components/results'
import WebRTCAudio from './_components/web-rtc-audio'

type Props = {
	params: Promise<Params>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params
	const tripId = params['id']

	const trip = await findOne<TripModel>(ApiEndpoints.TRIPS, tripId)

	return {
		title: `Journeys • Guía de Viaje - ${capitalCase(trip.code)}`,
		description: `Recibe asistencia en la guía de viaje: ${trip.code}.`,
	}
}

export default async function TripPage(props: Readonly<Props>) {
	const params = await props.params
	const tripId = params['id']
	const user = await getServerUser()
	const trip = await findOne<Required<TripModel>>(ApiEndpoints.TRIPS, tripId)

	console.log(trip)

	return (
		<Frame className='gap-5 sm:gap-4'>
			<FrameHeader className='gap-2 sm:flex-col sm:gap-2'>
				<section className='flex flex-col gap-5 sm:gap-0'>
					<FrameTitle>Guía de Viaje</FrameTitle>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href={`/${user?.userType?.toLocaleLowerCase()}/${Pathnames.TRIPS}`}>
									Viajes
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{capitalCase(trip.code)}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</section>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-6'>
				<WebRTCAudio tripId={tripId} />
				<Results criteria={trip.criteria} routes={trip.results} />
			</FrameBody>
		</Frame>
	)
}
