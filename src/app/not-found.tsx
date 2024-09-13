import Copyright from '@/common/components/ui/misc/copyright'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
	return (
		<section className='relative h-screen w-full bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='flex flex-col gap-10 justify-center items-center h-full'>
				<Image
					src='/illustrations/errors/not-found-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='size-56 sm:size-96'
				/>
				<section className='flex flex-col gap-2 max-w-xs items-center sm:max-w-sm md:max-w-lg'>
					<h1 className='text-center text-xl font-extrabold sm:text-2xl md:text-3xl'>
						¡Ups! Página no encontrada
					</h1>
					<p className='text-center text-sm font-medium text-zinc-500 sm:text-sm md:text-base'>
						Es posible que la página que buscas haya sido eliminada, que haya
						cambiado de nombre o que no esté disponible temporalmente.
					</p>
				</section>
				<Button asChild>
					<Link href='/'>Ir a Journeys</Link>
				</Button>
			</section>
			<Copyright className='absolute bottom-0 w-full' />
		</section>
	)
}
