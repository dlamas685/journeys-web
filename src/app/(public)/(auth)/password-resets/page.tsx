import { validateLink } from '@/common/actions/verification-tokens.action'
import { Pathnames } from '@/common/enums'
import { SearchParams } from '@/common/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AuthFrame from '../_components/auth-frame'
import PasswordResetsForm from '../_components/password-resets-form'

export const metadata: Metadata = {
	title: 'Journeys • Restablecer Contraseña',
	description:
		'Introduce tu nueva contraseña y repítela en el campo de confirmación para verificar que ambas coinciden',
}

type Props = {
	searchParams: Promise<SearchParams>
}

export default async function PasswordResetsPage(props: Readonly<Props>) {
	const searchParams = await props.searchParams
	const token = searchParams['token']
	const email = searchParams['email']

	if (!token || !email) notFound()

	const isValid = await validateLink(token, email)

	if (!isValid) notFound()

	return (
		<AuthFrame
			title='Reestablecer Contraseña'
			description='Introduce tu nueva contraseña y repítela en el campo de confirmación para verificar que ambas coinciden'
			redirectText='¿Recuerdas tu contraseña?'
			redirectLabel='Iniciar sesión'
			redirectTo={`/${Pathnames.LOGIN}`}>
			<PasswordResetsForm token={token} email={email} />
		</AuthFrame>
	)
}
