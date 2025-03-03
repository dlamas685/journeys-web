import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<Frame className='gap-5 sm:gap-3'>
			<FrameHeader className='sm:flex sm:flex-col sm:gap-1'>
				<section className='flex flex-col gap-1'>
					<FrameTitle>Guía de Viaje</FrameTitle>
					<Skeleton className='h-4 w-40' />
				</section>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-6'>
				<section className='flex flex-grow flex-col items-center justify-center gap-5'>
					<h2 className='text-lg font-semibold'>Asistente Inteligente</h2>

					<Skeleton className='h-36 w-full max-w-md sm:h-14 sm:max-w-lg' />
				</section>

				<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-2'>
					<section className='grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6'>
						<ul
							role='list'
							className='flex divide-y divide-accent font-secondary text-sm font-medium text-muted-foreground sm:block'>
							{[...Array(3)].map((_, index) => (
								<li
									key={index}
									className='flex items-center justify-center gap-1 rounded-md px-4 py-2 uppercase transition-all duration-200'>
									<Skeleton className='h-9 w-16' />
								</li>
							))}
						</ul>

						<section className='flex flex-col gap-2 font-secondary sm:gap-3'>
							<dl className='text-sm text-muted-foreground'>
								<dt className='font-medium text-foreground'>Métricas</dt>
								<dd className='flex flex-col gap-2 sm:gap-3'>
									<dl className='grid grid-cols-2 sm:grid-cols-[1fr_auto]'>
										<dt>Distancia:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Duración:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Duración estática:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Costo de peaje</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Paradas</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Puntos de paso</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Tramos</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
									</dl>
								</dd>
							</dl>

							<div className='flex flex-wrap gap-1'>
								{[...Array(2)].map((_, index) => (
									<Skeleton key={index} className='h-5 w-20' />
								))}
							</div>

							<section className='flex flex-wrap gap-2 sm:gap-3'>
								<Skeleton className='h-8 w-20' />

								<Skeleton className='h-8 w-20' />

								<Skeleton className='h-8 w-20' />

								<Skeleton className='h-8 w-20' />
							</section>
						</section>
					</section>

					<Skeleton className='h-96 w-full' />
				</section>
			</FrameBody>
		</Frame>
	)
}
