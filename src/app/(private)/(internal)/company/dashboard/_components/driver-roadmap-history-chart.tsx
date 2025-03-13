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
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
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
}

const DriverRoadmapHistoryChart = ({ topDrivers }: Readonly<Props>) => {
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
				<div className='flex gap-2 font-medium leading-none'>
					Los 5 conductores con más hojas de ruta completadas
				</div>
				<div className='leading-none text-muted-foreground'>
					Datos actualizados al{' '}
					{format(new Date(), 'PPP', {
						locale: es,
					})}
				</div>
			</CardFooter>
		</Card>
	)
}

export default DriverRoadmapHistoryChart
