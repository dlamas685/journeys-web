'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	const year = new Date().getFullYear()

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<section className='relative h-screen w-full bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='flex flex-col gap-10 justify-center items-center h-full'>
				<Image
					src='/illustrations/errors/internal-server-error-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='h-96'
				/>
				<section className='flex flex-col gap-2 max-w-lg items-center'>
					<h1 className='text-center text-3xl font-extrabold'>
						¡Ups! Error interno del servidor
					</h1>
					<p className='text-center text-base font-medium text-zinc-500'>
						Algo salió mal. Por favor, intenta de nuevo o regresa más tarde.
					</p>
				</section>
				<Button onClick={() => reset()}>Intentar de nuevo</Button>
			</section>
			<section className='absolute bottom-0 w-full flex justify-center items-center gap-2 p-5 text-zinc-400 text-sm'>
				&copy; {year} Journeys. Todos los derechos reservados.
			</section>
		</section>
	)
}
