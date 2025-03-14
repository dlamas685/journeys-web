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
	const currentDate = format(new Date(), 'PPP', {
		locale: es,
	})

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Panel de Control</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid flex-grow-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'>
				<Card className='flex flex-col border-none shadow-bento'>
					<CardHeader className='items-center pb-0 text-center'>
						<CardTitle>Histórico de Hojas de Ruta</CardTitle>
						<CardDescription>
							Resumen de hojas de rutas por estado hasta la fecha
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-1 pb-0'>
						<Skeleton className='aspect-square max-w-[200px]' />
					</CardContent>
					<CardFooter className='flex-col gap-2 text-sm'>
						<p className='flex items-center gap-2 font-medium leading-none'>
							<Skeleton className='h-4 w-40 rounded-full' />
						</p>
						<p className='leading-none text-muted-foreground'>
							Datos actualizados al {currentDate}
						</p>
					</CardFooter>
				</Card>
			</FrameBody>
		</Frame>
	)
}
