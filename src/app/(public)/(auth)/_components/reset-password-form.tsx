'use client'

import { resetPassword } from '@/common/actions/auth.action'
import InputPassword from '@/common/components/ui/form/input-password'
import { Pathnames } from '@/common/enums'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useForm, useFormState } from 'react-hook-form'
import { toast } from 'sonner'
import {
	ResetPasswordSchema,
	resetPasswordSchema,
} from '../_schemas/reset-password.schema'

type Props = {
	token: string
	email: string
}

const ResetPasswordForm = ({ token, email }: Readonly<Props>) => {
	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			token,
			email,
			password: '',
			confirm: '',
		},
	})

	const { isSubmitting } = useFormState(form)

	const handleSubmit = async ({
		password,
		email,
		token,
	}: ResetPasswordSchema) => {
		await resetPassword({
			email,
			password,
			token,
		})
			.then(() => {
				toast.success('Contraseña reestablecida', {
					duration: 3000,
					description: 'Inicia sesión con tu nueva contraseña',
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
				className='flex flex-col gap-4 mt-6 w-full '
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Ingresa tu nueva contraseña'
								/>
							</FormControl>
							<FormMessage className='max-w-xs' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirm'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Ingresa tu nueva contraseña'
								/>
							</FormControl>
							<FormMessage className='max-w-xs' />
						</FormItem>
					)}
				/>

				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='w-6 h-6 mr-1 animate-spin' />
					) : null}
					Reestablecer
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

export default ResetPasswordForm
