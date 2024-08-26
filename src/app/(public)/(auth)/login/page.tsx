import { Metadata } from 'next'
import LoginForm from '../_components/login-form'

export const metadata: Metadata = {
	title: 'Journeys • Iniciar Sesión',
}

export default function LoginPage() {
	return (
		<section className='flex flex-col items-center gap-1'>
			<h1 className='font-secondary font-semibold text-2xl'>
				Bienvenido de Nuevo
			</h1>
			<p className='font-secondary max-w-sm text-center text-sm text-foreground'>
				Inicia sesión para continuar explorando todas las funcionalidades
			</p>
			<LoginForm />
		</section>
	)
}
