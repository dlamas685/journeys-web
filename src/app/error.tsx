'use client' // Error components must be Client Components

import Copyright from '@/common/components/ui/misc/copyright'
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
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<section className='flex flex-col items-center min-h-screen w-full bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='flex flex-col gap-10 justify-center items-center flex-grow'>
				<Image
					src='/illustrations/errors/internal-server-error-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='size-56 sm:size-96 '
				/>
				<section className='flex flex-col gap-2 max-w-xs items-center sm:max-w-sm md:max-w-md'>
					<h1 className='text-center text-xl font-extrabold sm:text-2xl md:text-3xl'>
						¡Ups! Error interno del servidor
					</h1>
					<p className='text-center text-sm sm:text-sm md:text-base font-medium text-zinc-500'>
						Algo salió mal. Por favor, intenta de nuevo o regresa más tarde.
					</p>
				</section>
				<Button onClick={() => reset()}>Intentar de nuevo</Button>
			</section>
			<Copyright />
		</section>
	)
}
