import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Metadata } from 'next'
import {
	getCompanyStats,
	getCompanyStatsByMonth,
	getCompanyTopDrivers,
} from './_actions/stats.action'
import DriverRoadmapHistoryChart from './_components/driver-roadmap-history-chart'
import HistoricalRoadmapsChart from './_components/historical-roadmaps-chart'
import RoadmapCompletionDistributionChart from './_components/roadmap-completion-distribution-chart'

export const metadata: Metadata = {
	title: 'Journeys • Panel de Control',
	description:
		'Visualiza estadísticas y métricas de las hojas de ruta de tu empresa',
}

export default async function DashboardPage() {
	const companyStats = await getCompanyStats()

	const companyTopDrivers = await getCompanyTopDrivers()

	const companyStatsByMonth = await getCompanyStatsByMonth()

	const currentDate = new Date()

	const currentYear = new Date().getFullYear()

	const currentFormattedDate = format(currentDate, 'PPP', {
		locale: es,
	})

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Panel de Control</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<HistoricalRoadmapsChart
					companyStats={companyStats}
					currentFormattedDate={currentFormattedDate}
				/>
				<DriverRoadmapHistoryChart
					topDrivers={companyTopDrivers}
					currentFormattedDate={currentFormattedDate}
				/>
				<RoadmapCompletionDistributionChart
					companyStatsByMonth={companyStatsByMonth}
					currentFormattedDate={currentFormattedDate}
					currentYear={currentYear}
				/>
			</FrameBody>
		</Frame>
	)
}
