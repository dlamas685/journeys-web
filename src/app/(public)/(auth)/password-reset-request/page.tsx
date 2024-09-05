import { Pathnames } from '@/common/enums'
import { Metadata } from 'next'
import AuthFrame from '../_components/auth-frame'
import PasswordResetRequestForm from '../_components/password-reset-request-form'

export const metadata: Metadata = {
	title: 'Journeys • ¿Olvidaste tu contraseña?',
	description:
		'Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña',
}

export default function PassworResetRequestPage() {
	return (
		<AuthFrame
			title='¿Olvidaste tu contraseña?'
			description='Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña'
			redirectText='¿Recuerdas tu contraseña?'
			redirectLabel='Iniciar sesión'
			redirectTo={`/${Pathnames.LOGIN}`}>
			<PasswordResetRequestForm />
		</AuthFrame>
	)
}
