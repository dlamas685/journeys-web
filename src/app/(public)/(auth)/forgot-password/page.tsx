import ForgotPasswordForm from '../_components/forgot-password-form'

export default function ForgotPage() {
	return (
		<section className='flex flex-col items-center gap-1'>
			<h1 className='font-secondary font-semibold text-2xl'>
				¿Olvidaste tu contraseña?
			</h1>
			<p className='font-secondary max-w-sm text-center text-sm text-foreground'>
				Ingresa tu dirección de correo electrónico y te enviaremos un enlace
				para restablecer tu contraseña
			</p>
			<ForgotPasswordForm />
		</section>
	)
}
