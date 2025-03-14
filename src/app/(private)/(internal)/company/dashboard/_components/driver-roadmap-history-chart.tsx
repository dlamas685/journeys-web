'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { TopDriversModel } from '../_models'

const formatChartData = (topDrivers: TopDriversModel[]) => {
	const data = topDrivers.map((driver, index) => ({
		name: driver.name,
		completed: driver.countCompleted,
		fill: `hsl(var(--chart-${index + 1}))`,
	}))

	return data
}

const chartConfig = {
	completed: {
		label: 'Completadas',
	},
} satisfies ChartConfig

type Props = {
	topDrivers: TopDriversModel[]
	currentFormattedDate: string
}

const DriverRoadmapHistoryChart = ({
	topDrivers,
	currentFormattedDate,
}: Readonly<Props>) => {
	const chartData = formatChartData(topDrivers)

	return (
		<Card className='border-none shadow-bento'>
			<CardHeader>
				<CardTitle>Histórico de Conductores por Hojas de Ruta</CardTitle>
				<CardDescription>
					Ranking de conductores con más hojas de ruta completadas hasta la
					fecha
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{ left: 0 }}>
						<YAxis
							dataKey='name'
							type='category'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<XAxis dataKey='completed' type='number' hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey='completed' fill='hsl(var(--chart-1))' radius={5} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<p className='font-medium leading-none'>
					{topDrivers.length > 0
						? 'Los 5 conductores con más hojas de ruta completadas'
						: 'No hay conductores con hojas de ruta completadas'}
				</p>
				<div className='leading-none text-muted-foreground'>
					Datos actualizados al {currentFormattedDate}
				</div>
			</CardFooter>
		</Card>
	)
}

export default DriverRoadmapHistoryChart
