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
					<FrameTitle>Detalles</FrameTitle>
					<Skeleton className='h-4 w-40' />
				</section>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-6'>
				<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
					<Skeleton className='col-span-full h-72 w-full' />

					<section className='col-span-full grid grid-cols-1 gap-4 font-secondary sm:grid-cols-2 sm:gap-6'>
						<dl>
							<dt className='text-base font-medium text-foreground'>
								Métricas
							</dt>
							<dd className='text-sm text-muted-foreground'>
								<dl className='grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_auto]'>
									<dt>Distancia total:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>
									<dt>Duración en visitas:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>
									<dt>Duración en transito:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>
									<dt>Servicios incluidos:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Servicios desestimados:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Costo fijo </dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Costo por hora:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Costo por kilómetro:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Costo por hora de recorrida:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>

									<dt>Costo total:</dt>
									<dd>
										<Skeleton className='h-4 w-20' />
									</dd>
								</dl>
							</dd>
						</dl>

						<section className='flex flex-col gap-4 sm:gap-6'>
							<dl>
								<dt className='text-base font-medium text-foreground'>
									Operación
								</dt>
								<dd>
									<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[auto_1fr]'>
										<dt>Fecha:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Hora de inicio:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
										<dt>Hora de fin:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
									</dl>
								</dd>
							</dl>

							<dl>
								<dt className='text-base font-medium text-foreground'>
									Recursos
								</dt>
								<dd>
									<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[0.6fr_1fr]'>
										<dt>Flota:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
									</dl>

									<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[0.6fr_1fr]'>
										<dt>Vehículo:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
									</dl>

									<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[0.6fr_1fr]'>
										<dt>Conductor:</dt>
										<dd>
											<Skeleton className='h-4 w-20' />
										</dd>
									</dl>
								</dd>
							</dl>
						</section>

						<section className='flex gap-2'>
							<Skeleton className='h-8 w-20' />

							<Skeleton className='h-8 w-20' />

							<Skeleton className='h-8 w-20' />

							<Skeleton className='h-8 w-20' />
						</section>
					</section>
				</section>
			</FrameBody>
		</Frame>
	)
}
