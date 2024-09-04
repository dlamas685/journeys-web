import { Pathnames } from '@/common/enums'
import { Metadata } from 'next'
import AuthFrame from '../_components/auth-frame'
import LoginForm from '../_components/login-form'

export const metadata: Metadata = {
	title: 'Journeys • Iniciar Sesión',
	description:
		'Inicia sesión para continuar explorando todas las funcionalidades',
}

export default function LoginPage() {
	return (
		<AuthFrame
			title='Bienvenido de Nuevo'
			description='Inicia sesión para continuar explorando todas las funcionalidades'
			redirectText='¿No tienes una cuenta?'
			redirectLabel='Regístrate'
			redirectTo={`/${Pathnames.SIGN_UP}`}>
			<LoginForm />
		</AuthFrame>
	)
}
