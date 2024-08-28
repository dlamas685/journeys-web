import { validateLink } from '@/common/actions/verification-tokens.action'
import { SearchParams } from '@/common/types'
import { notFound } from 'next/navigation'
import ResetPasswordForm from '../_components/reset-password-form'

type Props = {
	searchParams: SearchParams
}

export default async function ResetPasswordPage({
	searchParams,
}: Readonly<Props>) {
	const token = searchParams['token']
	const email = searchParams['email']

	if (!token || !email) notFound()

	await validateLink(token, email)

	return (
		<section className='flex flex-col items-center gap-1'>
			<h1 className='font-secondary font-semibold text-2xl'>
				Reestablecer contraseña
			</h1>
			<p className='font-secondary max-w-sm text-center text-sm text-foreground'>
				Introduce tu nueva contraseña y repítela en el campo de confirmación
				para verificar que ambas coinciden
			</p>
			<ResetPasswordForm token={token} email={email} />
		</section>
	)
}
