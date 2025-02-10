import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

const ImportantInformation = () => {
	return (
		<div className='flex max-w-2xl flex-col gap-4 font-secondary sm:gap-6'>
			<h2 className='text-base font-medium tracking-tight text-foreground sm:text-lg'>
				Información importante
			</h2>
			<section className='flex flex-col gap-2 sm:gap-3'>
				<Alert variant='default' className='border-primary/20 bg-primary/5'>
					<InfoIcon className='h-5 w-5 text-primary' />
					<AlertTitle className='text-base font-semibold'>
						Optimización
					</AlertTitle>
					<AlertDescription className='mt-2 text-muted-foreground'>
						<ul className='list-disc'>
							<li>
								La optimización generada es aproximada y puede que varié
								dependiendo de los criterios establecidos y el momento en el que
								se visualice el viaje.
							</li>
							<li>
								En el caso que no podamos obtener una optimización adecuada para
								un viaje creado, le recomendamos que elimine el viaje y vuelva a
								crear uno nuevo.
							</li>
						</ul>
					</AlertDescription>
				</Alert>

				<Alert variant='default' className='border-primary/20 bg-primary/5'>
					<InfoIcon className='h-5 w-5 text-primary' />
					<AlertTitle className='text-base font-semibold'>Viajes</AlertTitle>
					<AlertDescription className='mt-2 text-muted-foreground'>
						<ul className='list-disc'>
							<li>
								Un viaje solo almacena los criterios con los que obtiene una
								optimización.
							</li>
							<li>
								Cuando hayas finalizado tu viaje no podrás modificarlo, ni
								reconstruir los resultados de optimización.
							</li>
						</ul>
					</AlertDescription>
				</Alert>
			</section>
		</div>
	)
}

export default ImportantInformation
