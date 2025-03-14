import Image from 'next/image'

export default function NotFound() {
	return (
		<section className='relative w-full'>
			<section className='flex h-full flex-col items-center justify-center gap-10'>
				<Image
					src='/illustrations/errors/not-found-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='size-56 sm:size-96'
				/>
				<section className='flex max-w-xs flex-col items-center gap-2 sm:max-w-sm md:max-w-lg'>
					<h1 className='text-center text-xl font-extrabold sm:text-2xl md:text-3xl'>
						¡Ups! Página no encontrada
					</h1>
					<p className='text-center text-sm font-medium text-zinc-500 sm:text-sm md:text-base'>
						Es posible que la página que buscas haya sido eliminada, que haya
						cambiado de nombre o que no esté disponible temporalmente.
					</p>
				</section>
			</section>
		</section>
	)
}
