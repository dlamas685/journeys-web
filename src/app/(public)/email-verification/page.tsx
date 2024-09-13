import Copyright from '@/common/components/ui/misc/copyright'
import { SearchParams } from '@/common/types'
import { Button } from '@/components/ui/button'
import { Waypoints } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Journeys • Verificación de Correo Electrónico',
	description: '¡Tu correo electrónico ha sido verificado con éxito!',
}

type Props = {
	searchParams: SearchParams
}

export default async function EmailVerificationPage({
	searchParams,
}: Readonly<Props>) {
	const token = searchParams['token']
	const email = searchParams['email']

	// const resp = await verifyEmail(token, email)

	// if ('error' in resp) notFound()

	return (
		<section className='relative flex flex-col justify-center items-center w-full h-screen bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='absolute top-1 left-1 w-full flex items-center gap-2 p-5 text-orange-600 sm:top-2 sm:left-2'>
				<Waypoints className='size-5' />
				<span className='font-secondary font-bold'>JOURNEYS</span>
			</section>

			<div className='flex flex-col flex-grow justify-center items-center gap-1 max-w-xs sm:gap-3 sm:max-w-md'>
				<Image
					className='mb-5 size-64 md:size-80'
					src='/illustrations/presentation/email-verification-01.svg'
					alt='Email verification'
					width={200}
					height={200}
				/>
				<h1 className='font-secondary text-xl font-extrabold text-center sm:text-3xl'>
					¡Verificación completada!
				</h1>
				<h2 className='font-secondary text-lg font-semibold text-center sm:text-xl'>
					¡Tu correo electrónico ha sido verificado con éxito!
				</h2>
				<p className='font-secondart text-sm font-medium text-center text-zinc-500 md:max-w-2xl sm:text-base'>
					Ahora solo queda completar tu perfil para disfrutar de todas las
					funcionalidades avanzadas de Journeys.
				</p>
				<Button variant='link' asChild>
					<Link className='font-semibold text-base' href='/login'>
						Ir a mi perfil
					</Link>
				</Button>
			</div>

			<Copyright />
		</section>
	)
}
