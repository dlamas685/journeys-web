'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
import { capitalCase } from 'change-case'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatsByMonthModel } from '../_models'

const formatChartData = (
	data: StatsByMonthModel[]
): { month: string; countArchived: number; countNotArchived: number }[] => {
	const months = Array.from({ length: 12 }, (_, index) => ({
		month: capitalCase(
			format(new Date(2025, index, 1), 'MMMM', {
				locale: es,
			})
		),
		countArchived: 0,
		countNotArchived: 0,
	}))

	data.forEach(({ month, countArchived, countNotArchived }) => {
		const monthIndex = month - 1
		if (monthIndex >= 0 && monthIndex < 12) {
			months[monthIndex].countArchived = countArchived
			months[monthIndex].countNotArchived = countNotArchived
		}
	})

	return months
}

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

type Props = {
	statsByMonth: StatsByMonthModel[]
	currentYear: number
	currentFormattedDate: string
}

const TripConditionDistributionChart = ({
	statsByMonth,
	currentYear,
	currentFormattedDate,
}: Readonly<Props>) => {
	const chartData = formatChartData(statsByMonth)

	return (
		<Card className='border-none shadow-bento'>
			<CardHeader>
				<CardTitle>Distribución de Viajes - Condición</CardTitle>
				<CardDescription>
					Resumen por mes en {currentYear} de viajes para ambas condiciones
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={value => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dashed' />}
						/>
						<Bar
							dataKey='countArchived'
							fill='var(--color-countArchived)'
							radius={4}
						/>
						<Bar
							dataKey='countNotArchived'
							fill='var(--color-countNotArchived)'
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='leading-none text-muted-foreground'>
					Datos actualizados al {currentFormattedDate}
				</div>
			</CardFooter>
		</Card>
	)
}

export default TripConditionDistributionChart
