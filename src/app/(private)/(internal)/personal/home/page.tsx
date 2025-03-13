import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { SearchParams } from '@/common/types'
import { Metadata } from 'next'
import { parseParam } from '../../company/dashboard/_utils/parse-param.util'
import { getStats, getStatsByMonth } from './_actions/stats.action'
import HistoricalTripsChart from './_components/historical-trips-chart'
import TripConditionDistributionChart from './_components/trip-condition-distribution-chart'

export const metadata: Metadata = {
	title: 'Journeys • Inicio',
	description: 'Bienvenido a Journeys, disfruta de tu estancia',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function HomePage(props: Readonly<Props>) {
	const searchParams = await props.searchParams

	const year = parseParam(searchParams['year'])

	const month = parseParam(searchParams['month'])

	const stats = await getStats()

	const statsByMonth = await getStatsByMonth()

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Inicio</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<HistoricalTripsChart stats={stats} />
				<TripConditionDistributionChart statsByMonth={statsByMonth} />
			</FrameBody>
		</Frame>
	)
}
