import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Metadata } from 'next'
import { getStats, getStatsByMonth } from './_actions/stats.action'
import HistoricalTripsChart from './_components/historical-trips-chart'
import TripConditionDistributionChart from './_components/trip-condition-distribution-chart'

export const metadata: Metadata = {
	title: 'Journeys • Inicio',
	description: 'Bienvenido a Journeys, disfruta de tu estancia',
}

export default async function HomePage() {
	const currentDate = new Date()

	const currentFormattedDate = format(currentDate, 'PPP', {
		locale: es,
	})

	const currentYear = currentDate.getFullYear()

	const stats = await getStats()

	const statsByMonth = await getStatsByMonth(currentYear)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Inicio</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<HistoricalTripsChart
					stats={stats}
					currentFormattedDate={currentFormattedDate}
				/>
				<TripConditionDistributionChart
					statsByMonth={statsByMonth}
					currentFormattedDate={currentFormattedDate}
					currentYear={currentYear}
				/>
			</FrameBody>
		</Frame>
	)
}
