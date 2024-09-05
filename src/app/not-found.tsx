import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
	const year = new Date().getFullYear()

	return (
		<section className='realtive h-screen w-full bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='flex flex-col gap-10 justify-center items-center h-full'>
				<Image
					src='/illustrations/errors/not-found-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='h-96'
				/>
				<section className='flex flex-col gap-2 max-w-lg items-center'>
					<h1 className='text-center text-3xl font-extrabold'>
						¡Ups! Página no encontrada
					</h1>
					<p className='text-center text-base font-medium text-zinc-500'>
						Es posible que la página que buscas haya sido eliminada, que haya
						cambiado de nombre o que no esté disponible temporalmente.
					</p>
				</section>
				<Button asChild>
					<Link className='text-lg font-semibold' href='/'>
						Ir a Journeys
					</Link>
				</Button>
			</section>
			<section className='absolute bottom-0 w-full flex justify-center items-center gap-2 p-5 text-zinc-400 text-sm'>
				&copy; {year} Journeys. Todos los derechos reservados.
			</section>
		</section>
	)
}
