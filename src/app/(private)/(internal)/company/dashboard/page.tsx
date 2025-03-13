import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { SearchParams } from '@/common/types'
import { Metadata } from 'next'
import {
	getCompanyStats,
	getCompanyStatsByMonth,
	getCompanyTopDrivers,
} from './_actions/stats.action'
import DriverRoadmapHistoryChart from './_components/driver-roadmap-history-chart'
import HistoricalRoadmapsChart from './_components/historical-roadmaps-chart'
import RoadmapCompletionDistributionChart from './_components/roadmap-completion-distribution-chart'
import { parseParam } from './_utils/parse-param.util'

export const metadata: Metadata = {
	title: 'Journeys • Panel de Control',
	description:
		'Visualiza estadísticas y métricas de las hojas de ruta de tu empresa',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function DashboardPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams

	const year = parseParam(searchParams['year'])

	const month = parseParam(searchParams['month'])

	const companyStatsByMonth = await getCompanyStatsByMonth(year, month)

	const companyStats = await getCompanyStats()

	const companyTopDrivers = await getCompanyTopDrivers()

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Panel de Control</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<HistoricalRoadmapsChart companyStats={companyStats} />
				<DriverRoadmapHistoryChart topDrivers={companyTopDrivers} />
				<RoadmapCompletionDistributionChart
					companyStatsByMonth={companyStatsByMonth}
				/>
			</FrameBody>
		</Frame>
	)
}
