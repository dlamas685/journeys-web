'use client'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'

const CustomCarousel = () => {
	return (
		<>
			<Carousel
				className='flex w-full max-w-sm flex-grow items-center'
				plugins={[
					Autoplay({
						delay: 5000,
					}),
					Fade({
						active: true,
					}),
				]}
				opts={{
					align: 'center',
					containScroll: false,
				}}>
				<CarouselContent>
					<CarouselItem>
						<Image
							src='/illustrations/presentation/travel-plans.svg'
							alt='Travel Plans'
							width={512}
							height={512}
							className='h-96'
							priority
						/>
					</CarouselItem>
					<CarouselItem>
						<Image
							src='/illustrations/presentation/next-tasks.svg'
							alt='Next Tasks'
							width={512}
							height={512}
							className='h-96'
							priority
						/>
					</CarouselItem>
					<CarouselItem>
						<Image
							src='/illustrations/presentation/assistant-02.svg'
							alt='Assistant'
							width={512}
							height={512}
							className='h-96'
							priority
						/>
					</CarouselItem>
					<CarouselItem>
						<Image
							src='/illustrations/presentation/process.svg'
							alt='Process'
							width={512}
							height={512}
							className='h-96'
							priority
						/>
					</CarouselItem>
				</CarouselContent>
			</Carousel>
			<Carousel
				className='w-full p-6'
				plugins={[
					Autoplay({
						delay: 5000,
					}),
					Fade({
						active: true,
					}),
				]}
				opts={{
					align: 'center',
					containScroll: false,
				}}>
				<CarouselContent>
					<CarouselItem>
						<p className='font-primary text-base font-medium italic'>
							&quot;Planifica tus viajes con una combinación perfecta de
							funciones básicas y avanzadas que te permiten personalizar cada
							detalle según tus necesidades.&quot;
						</p>
					</CarouselItem>
					<CarouselItem>
						<p className='font-primary text-base font-medium'>
							&quot;Incorpora fácilmente todas las actividades que realizarás
							durante tu viaje, asegurando que cada momento esté perfectamente
							organizado.&quot;
						</p>
					</CarouselItem>
					<CarouselItem>
						<p className='font-primary text-base font-medium'>
							&quot;Recibe asistencia personalizada con un asistente impulsado
							por inteligencia artificial. Consulta los detalles de tu viaje,
							conoce los criterios establecidos y obtén recomendaciones, además
							de indicaciones claras para cada etapa del recorrido.&quot;
						</p>
					</CarouselItem>
					<CarouselItem>
						<p className='font-primary text-base font-medium'>
							&quot;Da el primer paso para transformar tu negocio en una empresa
							exitosa con nuestra plataforma. Gestiona tus flotas mediante hojas
							de rutas con servicios a domicilio.&quot;
						</p>
					</CarouselItem>
				</CarouselContent>
			</Carousel>
		</>
	)
}

export default CustomCarousel
