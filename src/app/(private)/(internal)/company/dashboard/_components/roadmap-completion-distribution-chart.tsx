'use client'

import { format } from 'date-fns'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

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
import { es } from 'date-fns/locale'
import { CompanyStatsByMonthModel } from '../_models'

const formatChartData = (
	data: CompanyStatsByMonthModel[]
): { month: string; countCompleted: number }[] => {
	const months = Array.from({ length: 12 }, (_, index) => ({
		month: capitalCase(
			format(new Date(2025, index, 1), 'MMM', {
				locale: es,
			})
		),
		countCompleted: 0,
	}))

	data.forEach(({ month, countCompleted }) => {
		const monthIndex = month - 1
		if (monthIndex >= 0 && monthIndex < 12) {
			months[monthIndex].countCompleted = countCompleted
		}
	})

	return months
}

const calculateTrend = (data: { month: string; countCompleted: number }[]) => {
	const lastMonthIndex = new Date().getMonth()
	const prevMonthIndex = lastMonthIndex - 1

	const lastMonthValue = data[lastMonthIndex]?.countCompleted || 0
	const prevMonthValue =
		prevMonthIndex >= 0 ? data[prevMonthIndex]?.countCompleted || 0 : 0

	if (prevMonthValue === 0)
		return 'No es posible evaluar la tendencia debido a que el mes anterior no tiene datos'

	const trendPercentage =
		((lastMonthValue - prevMonthValue) / prevMonthValue) * 100
	return trendPercentage
}

const chartConfig: ChartConfig = {
	countCompleted: {
		label: 'Completado',
		color: 'hsl(var(--chart-1))',
	},
}

type Props = {
	companyStatsByMonth: CompanyStatsByMonthModel[]
}

const RoadmapCompletionDistributionChart = ({
	companyStatsByMonth,
}: Readonly<Props>) => {
	const chartData = formatChartData(companyStatsByMonth)
	const trend = calculateTrend(chartData)
	const isPositiveTrend = typeof trend === 'number' && trend >= 0

	return (
		<Card className='col-span-full border-none shadow-bento'>
			<CardHeader>
				<CardTitle>Distribución de Hojas de Ruta - Estado Completado</CardTitle>
				<CardDescription>
					Resumen por mes en {companyStatsByMonth[0]?.year || 'Año Actual'} de
					hojas de rutas con estado completado
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey='countCompleted' fill='hsl(var(--chart-1))' radius={8}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				{typeof trend === 'string' ? (
					<div className='flex gap-2 font-medium leading-none'>{trend}</div>
				) : (
					<div className='flex gap-2 font-medium leading-none'>
						Tendencia {isPositiveTrend ? 'en alza' : 'a la baja'} del{' '}
						{trend.toFixed(2)}% este mes
						{isPositiveTrend ? (
							<TrendingUp className='h-4 w-4' />
						) : (
							<TrendingDown className='h-4 w-4' />
						)}
					</div>
				)}
				<div className='leading-none text-muted-foreground'>
					Datos actualizados al{' '}
					{format(new Date(), 'PPP', {
						locale: es,
					})}{' '}
				</div>
			</CardFooter>
		</Card>
	)
}

export default RoadmapCompletionDistributionChart
