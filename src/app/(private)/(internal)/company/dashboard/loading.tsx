import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Loading() {
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
				<Card className='flex flex-col border-none shadow-bento'>
					<CardHeader className='items-center text-center'>
						<CardTitle>Histórico de Hojas de Ruta</CardTitle>
						<CardDescription>
							Resumen de hojas de rutas por estado hasta la fecha
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-1'>
						<Skeleton className='h-full w-full' />
					</CardContent>
					<CardFooter className='flex-col gap-2 text-sm'>
						<div className='flex w-3/4 items-center gap-2 font-medium leading-none'>
							<Skeleton className='h-4 w-full rounded-full' />
						</div>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al {currentFormattedDate}
						</p>
					</CardFooter>
				</Card>

				<Card className='border-none shadow-bento'>
					<CardHeader>
						<CardTitle>Histórico de Conductores por Hojas de Ruta</CardTitle>
						<CardDescription>
							Ranking de conductores con más hojas de ruta completadas hasta la
							fecha
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-1'>
						<Skeleton className='h-[12.5rem] w-full' />
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex w-3/4 items-center gap-2 font-medium leading-none'>
							<Skeleton className='h-4 w-full rounded-full' />
						</div>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al {currentFormattedDate}
						</p>
					</CardFooter>
				</Card>

				<Card className='col-span-full border-none shadow-bento'>
					<CardHeader>
						<CardTitle>
							Distribución de Hojas de Ruta - Estado Completado
						</CardTitle>
						<CardDescription>
							Resumen por mes en {currentYear} de hojas de rutas con estado
							completado
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-96 w-full' />
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex w-3/4 items-center gap-2 font-medium leading-none'>
							<Skeleton className='h-4 w-full rounded-full' />
						</div>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al
							{currentFormattedDate}
						</p>
					</CardFooter>
				</Card>
			</FrameBody>
		</Frame>
	)
}
