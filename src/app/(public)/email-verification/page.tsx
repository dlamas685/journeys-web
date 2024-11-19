import { verifyEmail } from '@/common/actions/auth.action'
import Copyright from '@/common/components/ui/misc/copyright'
import { SearchParams } from '@/common/types'
import { Button } from '@/components/ui/button'
import { Waypoints } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Journeys • Verificación de Correo Electrónico',
	description: '¡Tu correo electrónico ha sido verificado con éxito!',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function EmailVerificationPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const token = searchParams['token']
	const email = searchParams['email']

	const resp = await verifyEmail(token, email)

	if ('error' in resp) notFound()

	return (
		<section className='relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='absolute left-1 top-1 flex w-full items-center gap-2 p-5 text-orange-600 sm:left-2 sm:top-2'>
				<Waypoints className='size-5' />
				<span className='font-secondary font-bold'>JOURNEYS</span>
			</section>

			<div className='flex max-w-xs flex-grow flex-col items-center justify-center gap-1 sm:max-w-md sm:gap-3'>
				<Image
					className='mb-5 size-64 md:size-80'
					src='/illustrations/presentation/email-verification-01.svg'
					alt='Email verification'
					width={200}
					height={200}
				/>
				<h1 className='text-center font-secondary text-xl font-extrabold sm:text-3xl'>
					¡Verificación completada!
				</h1>
				<h2 className='text-center font-secondary text-lg font-semibold sm:text-xl'>
					¡Tu correo electrónico ha sido verificado con éxito!
				</h2>
				<p className='font-secondart text-center text-sm font-medium text-zinc-500 sm:text-base md:max-w-2xl'>
					Ahora solo queda completar tu perfil para disfrutar de todas las
					funcionalidades avanzadas de Journeys.
				</p>
				<Button variant='link' asChild>
					<Link className='text-base font-semibold' href='/login'>
						Ir a mi perfil
					</Link>
				</Button>
			</div>

			<Copyright />
		</section>
	)
}
