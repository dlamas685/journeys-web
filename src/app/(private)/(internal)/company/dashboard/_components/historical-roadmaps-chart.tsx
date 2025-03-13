'use client'

import { Activity, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

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
import { useMemo } from 'react'
import { CompanyStatsModel } from '../_models'

const chartConfig = {
	visitors: {
		label: 'Hojas de ruta',
	},
	upcoming: {
		label: 'Próximo',
		color: 'hsl(var(--chart-1))',
	},
	ongoing: {
		label: 'En curso',
		color: 'hsl(var(--chart-2))',
	},
	completed: {
		label: 'Completado',
		color: 'hsl(var(--chart-3))',
	},
	dismissed: {
		label: 'Desestimado',
		color: 'hsl(var(--chart-4))',
	},
	other: {
		label: 'Otro',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig

const getStatusMessage = (
	completed: number,
	dismissed: number,
	threshold: number = 2
) => {
	const difference = completed - dismissed

	if (difference >= threshold) {
		return {
			message: 'Crecimiento amplio de completado',
			icon: <TrendingUp className='h-4 w-4' />,
		}
	} else if (difference <= -threshold) {
		return {
			message: 'Crecimiento amplio de desestimado',
			icon: <TrendingDown className='h-4 w-4' />,
		}
	} else if (completed > 0 || dismissed > 0) {
		return {
			message: 'Equilibrio entre completado y desestimado',
			icon: <Activity className='h-4 w-4' />,
		}
	} else {
		return {
			message: 'No hay suficientes datos para evaluar',
			icon: <XCircle className='h-4 w-4' />,
		}
	}
}

const formatData = (companyStats: CompanyStatsModel) => {
	return [
		{
			status: 'upcoming',
			roadmaps: companyStats.totalUpcoming,
			fill: 'var(--color-upcoming)',
		},
		{
			status: 'ongoing',
			roadmaps: companyStats.totalOngoing,
			fill: 'var(--color-ongoing)',
		},
		{
			status: 'completed',
			roadmaps: companyStats.totalCompleted,
			fill: 'var(--color-completed)',
		},
		{
			status: 'dismissed',
			roadmaps: companyStats.totalDismissed,
			fill: 'var(--color-dismissed)',
		},
	]
}

type Props = {
	companyStats: CompanyStatsModel
}

const HistoricalRoadmapsChart = ({
	companyStats: companyStats,
}: Readonly<Props>) => {
	const chartData = formatData(companyStats)

	const statusInfo = useMemo(
		() =>
			getStatusMessage(
				chartData.find(({ status }) => status === 'completed')?.roadmaps || 0,
				chartData.find(({ status }) => status === 'dismissed')?.roadmaps || 0
			),
		[chartData]
	)

	return (
		<Card className='flex flex-col border-none shadow-bento'>
			<CardHeader className='items-center pb-0 text-center'>
				<CardTitle>Histórico de Hojas de Ruta</CardTitle>
				<CardDescription>
					Resumen de hojas de rutas por estado hasta la fecha
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px]'>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey='roadmaps'
							nameKey='status'
							innerRadius={60}
							strokeWidth={5}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'>
													{companyStats.total.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'>
													Hojas de ruta
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<p className='flex items-center gap-2 font-medium leading-none'>
					{statusInfo.message} {statusInfo.icon}
				</p>
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

export default HistoricalRoadmapsChart
