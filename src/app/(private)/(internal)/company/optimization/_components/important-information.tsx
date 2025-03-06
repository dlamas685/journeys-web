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
								Cuando creas una hoja de ruta, se genera automáticamente una
								optimización basada en los criterios que seleccionaste.
							</li>
							<li>
								La optimización no es fija. Cada vez que consultes tu hoja de
								rutas antes de la fecha y hora de inicio programada, el sistema
								generará una nueva optimización con la información más
								actualizada.
							</li>
							<li>
								Si los resultados no son los esperados, puedes crear una nueva
								hoja de ruta para obtener una mejor optimización.
							</li>
						</ul>
					</AlertDescription>
				</Alert>

				<Alert variant='default' className='border-primary/20 bg-primary/5'>
					<CarTaxiFront className='h-5 w-5 text-primary' />
					<AlertTitle className='text-base font-semibold'>
						Sobre las hojas de rutas
					</AlertTitle>
					<AlertDescription className='mt-2 text-muted-foreground'>
						<ul className='list-disc space-y-2'>
							<li>
								Una hoja de ruta{' '}
								<b>
									almacena únicamente la configuración establecida al crearla.
								</b>{' '}
								Actualmente,{' '}
								<b>
									no incluye un sistema de navegación con control de
									estadísticas en tiempo real
								</b>
								, solo genera una optimización según la configuración
								establecida.
							</li>
							<li>
								<b>
									Cada vez que consultes tu hoja de ruta antes de la fecha y
									hora de inicio que estableciste, el sistema generará una nueva
									optimización para esta hoja de ruta
								</b>{' '}
								con la información más actualizada.
								<ul className='list-disc space-y-2 py-4 pl-6'>
									<li>
										Por ejemplo, si programaste el inicio para el día de mañana
										a las 16:00, al consultar en la mañana a las 8:00 podrías
										ver una optimización, y al volver a consultar a las 12:00
										podrías obtener una versión diferente debido a cambios en el
										tráfico y otros factores.
									</li>
									<li>
										Sin embargo,
										<b>
											10 minutos antes de la hora de inicio programada, la
											optimización quedará fija y no cambiará más
										</b>
										, ya que el sistema guardará ese resultado para evitar
										errores en la gestión de flotas.
									</li>
								</ul>
							</li>
							<li>
								<b>
									Por ahora, la configuración de una hoja de ruta no puede
									modificarse después de crearla.
								</b>{' '}
								Si necesitas cambios, deberás crear una nueva hoja de ruta con
								los ajustes deseados.
							</li>
						</ul>
					</AlertDescription>
				</Alert>
			</section>
		</div>
	)
}

export default ImportantInformation
