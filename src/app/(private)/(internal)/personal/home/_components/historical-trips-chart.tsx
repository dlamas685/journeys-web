'use client'

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

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
import { StatsModel } from '../_models'
const chartData = [
	{ month: 'january', countArchived: 1260, countNotArchived: 570 },
]

const chartConfig = {
	countArchived: {
		label: 'Usados',
		color: 'hsl(var(--chart-4))',
	},
	countNotArchived: {
		label: 'Listo para usar',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

const formatData = (stats: StatsModel) => {
	return [
		{
			month: 'january',
			countArchived: stats.totalArchived,
			countNotArchived: stats.totalNoArchived,
		},
	]
}

type Props = {
	stats: StatsModel
	currentFormattedDate: string
}

const HistoricalTripsChart = ({
	stats,
	currentFormattedDate,
}: Readonly<Props>) => {
	const chartData = formatData(stats)

	return (
		<Card className='flex flex-col border-none shadow-bento'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Histórico de Viajes</CardTitle>
				<CardDescription>
					Resumen de viajes por condición hasta la fecha
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-1 items-center pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square w-full max-w-[250px]'>
					<RadialBarChart
						data={chartData}
						endAngle={180}
						innerRadius={80}
						outerRadius={130}>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 16}
													className='fill-foreground text-2xl font-bold'>
													{stats.total.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 4}
													className='fill-muted-foreground'>
													Viajes
												</tspan>
											</text>
										)
									}
								}}
							/>
						</PolarRadiusAxis>
						<RadialBar
							dataKey='countArchived'
							stackId='a'
							cornerRadius={5}
							fill='var(--color-countArchived)'
							className='stroke-transparent stroke-2'
						/>
						<RadialBar
							dataKey='countNotArchived'
							fill='var(--color-countNotArchived)'
							stackId='a'
							cornerRadius={5}
							className='stroke-transparent stroke-2'
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<p className='leading-none text-muted-foreground'>
					Datos actualizados al {currentFormattedDate}
				</p>
			</CardFooter>
		</Card>
	)
}

export default HistoricalTripsChart
