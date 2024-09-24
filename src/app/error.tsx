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
		<section className='flex min-h-screen w-full flex-col items-center bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='flex flex-grow flex-col items-center justify-center gap-10'>
				<Image
					src='/illustrations/errors/internal-server-error-01.svg'
					alt='Not Found'
					width={512}
					height={512}
					className='size-56 sm:size-96'
				/>
				<section className='flex max-w-xs flex-col items-center gap-2 sm:max-w-sm md:max-w-md'>
					<h1 className='text-center text-xl font-extrabold sm:text-2xl md:text-3xl'>
						¡Ups! Error interno del servidor
					</h1>
					<p className='text-center text-sm font-medium text-zinc-500 sm:text-sm md:text-base'>
						Algo salió mal. Por favor, intenta de nuevo o regresa más tarde.
					</p>
				</section>
				<Button onClick={() => reset()}>Intentar de nuevo</Button>
			</section>
			<Copyright />
		</section>
	)
}
