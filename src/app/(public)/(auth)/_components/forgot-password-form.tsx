'use client'
import { requestPasswordReset } from '@/common/actions/auth.action'
import { Pathnames } from '@/common/enums'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useForm, useFormState } from 'react-hook-form'
import { toast } from 'sonner'
import {
	ForgotPasswordSchema,
	forgotPasswordSchema,
} from '../_schemas/forgot-password.schema'

const ForgotPasswordForm = () => {
	const form = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const { isSubmitting } = useFormState(form)

	const handleSubmit = async ({ email }: ForgotPasswordSchema) => {
		await requestPasswordReset(email)
			.then(() => {
				toast.success('Enlace enviado', {
					duration: 3000,
					description: 'Revisa tu bandeja de entrada',
					position: 'top-right',
				})
				form.reset()
			})
			.catch(error => {
				toast.error(error.name, {
					duration: 3000,
					description: error.message,
					position: 'top-right',
				})
			})
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col gap-4 mt-6 w-full'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa tu dirección de correo electrónico'
									type='email'
								/>
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='w-6 h-6 mr-1 animate-spin' />
					) : null}
					Enviar enlace
				</Button>

				<p className='text-sm text-center font-secondary'>
					¿Recuerdas tu contraseña?
					<Button className='px-1' variant='link' asChild>
						<Link href={`/${Pathnames.LOGIN}`}>Iniciar sesión</Link>
					</Button>
				</p>
			</form>
		</Form>
	)
}

export default ForgotPasswordForm
