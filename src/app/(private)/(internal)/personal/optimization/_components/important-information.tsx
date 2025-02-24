import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CarTaxiFront, Route } from 'lucide-react'

const ImportantInformation = () => {
	return (
		<div className='flex max-w-2xl flex-col gap-4 font-secondary sm:gap-6'>
			<h2 className='text-base font-medium tracking-tight text-foreground sm:text-lg'>
				Información importante
			</h2>
			<section className='flex flex-col gap-2 sm:gap-3'>
				<Alert variant='default' className='border-primary/20 bg-primary/5'>
					<Route className='h-5 w-5 text-primary' />
					<AlertTitle className='text-base font-semibold'>
						Sobre la optimización
					</AlertTitle>
					<AlertDescription className='mt-2 text-muted-foreground'>
						<ul className='list-disc space-y-2'>
							<li>
								Cuando creas un viaje, se genera automáticamente una
								optimización basada en los criterios que seleccionaste.
							</li>
							<li>
								La optimización no es fija. Cada vez que consultes tu viaje
								antes de la fecha y hora de salida programada, el sistema
								generará una nueva guía optimizada con la información más
								actualizada.
							</li>
							<li>
								Si los resultados no son los esperados, puedes crear un nuevo
								viaje con diferentes criterios para obtener una mejor guía.
							</li>
						</ul>
					</AlertDescription>
				</Alert>

				<Alert variant='default' className='border-primary/20 bg-primary/5'>
					<CarTaxiFront className='h-5 w-5 text-primary' />
					<AlertTitle className='text-base font-semibold'>
						Sobre los viajes
					</AlertTitle>
					<AlertDescription className='mt-2 text-muted-foreground'>
						<ul className='list-disc space-y-2'>
							<li>
								Un viaje{' '}
								<b>
									almacena únicamente los criterios que elegiste al crearlo.
								</b>{' '}
								Actualmente,{' '}
								<b>
									no incluye un sistema de navegación con control de
									estadísticas en tiempo real
								</b>
								, solo genera una guía optimizada según los criterios que
								seleccionaste.
							</li>
							<li>
								<b>
									Cada vez que consultes tu viaje antes de la fecha y hora de
									salida que estableciste, el sistema generará una nueva guía
									optimizada
								</b>{' '}
								con la información más actualizada.
								<ul className='list-disc space-y-2 py-4 pl-6'>
									<li>
										Por ejemplo, si programaste tu salida para el día de mañana
										a las 16:00, al consultar en la mañana a las 8:00 podrías
										ver una guía, y al volver a consultar a las 12:00 podrías
										obtener una versión diferente debido a cambios en el tráfico
										y otros factores.
									</li>
									<li>
										Sin embargo,{' '}
										<b>
											una vez que llegue la fecha y hora programada, la guía
											quedará fija y no cambiará más
										</b>
										, ya que el sistema guardará ese resultado para evitar
										errores en la planificación.
									</li>
								</ul>
							</li>
							<li>
								<b>
									Por ahora, los criterios de un viaje no pueden modificarse
									después de crearlo.
								</b>{' '}
								Si necesitas cambios, deberás crear un nuevo viaje con los
								ajustes deseados.
							</li>
						</ul>
					</AlertDescription>
				</Alert>
			</section>
		</div>
	)
}

export default ImportantInformation
