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

	const currentFormattedDate = format(currentDate, 'PPP', {
		locale: es,
	})

	const currentYear = currentDate.getFullYear()

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Inicio</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<Card className='flex flex-col border-none shadow-bento'>
					<CardHeader className='items-center'>
						<CardTitle>Histórico de Viajes</CardTitle>
						<CardDescription>
							Resumen de viajes por condición hasta la fecha
						</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-1 items-center'>
						<Skeleton className='h-[12.5rem] w-full' />
					</CardContent>
					<CardFooter className='flex-col gap-2 text-sm'>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al {currentFormattedDate}
						</p>
					</CardFooter>
				</Card>

				<Card className='border-none shadow-bento'>
					<CardHeader>
						<CardTitle>Distribución de Viajes - Condición</CardTitle>
						<CardDescription>
							Resumen por mes en {currentYear} de viajes para ambas condiciones
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[12.5rem] w-full' />
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al {currentFormattedDate}
						</p>
					</CardFooter>
				</Card>
			</FrameBody>
		</Frame>
	)
}
