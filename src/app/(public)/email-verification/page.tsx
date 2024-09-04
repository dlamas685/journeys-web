import { verifyEmail } from '@/common/actions/auth.action'
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
	searchParams: SearchParams
}

export default async function EmailVerificationPage({
	searchParams,
}: Readonly<Props>) {
	const token = searchParams['token']
	const email = searchParams['email']

	const resp = await verifyEmail(token, email)

	if ('error' in resp) notFound()

	const year = new Date().getFullYear()

	return (
		<section className='relative flex justify-center items-center w-full h-screen bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<section className='absolute top-2 left-2 w-full flex items-center gap-2 p-5 text-orange-600'>
				<Waypoints size={20} />
				<span className='font-secondary font-bold'>JOURNEYS</span>
			</section>

			<div className='flex flex-col items-center gap-3'>
				<Image
					className='mb-5 size-72 md:size-80'
					src='/illustrations/presentation/email-verification-01.svg'
					alt='Email verification'
					width={200}
					height={200}
				/>
				<h1 className='font-secondary text-2xl font-extrabold text-center md:text-3xl'>
					¡Verificación completada!
				</h1>
				<h2 className='font-secondary text-lg font-semibold text-center md:text-xl'>
					¡Tu correo electrónico ha sido verificado con éxito!
				</h2>
				<p className='font-secondart text-sm font-medium text-center text-zinc-500 md:max-w-2xl md:text-base'>
					Ahora solo queda completar tu perfil para disfrutar de todas las
					funcionalidades avanzadas de Journeys.
				</p>
				<Button variant='link' asChild>
					<Link className='font-semibold text-base' href='/login'>
						Ir a mi perfil
					</Link>
				</Button>
			</div>

			<section className='absolute bottom-0 w-full flex justify-center items-center gap-2 p-5 text-zinc-400 text-sm'>
				&copy; {year} Journeys. Todos los derechos reservados.
			</section>
		</section>
	)
}
