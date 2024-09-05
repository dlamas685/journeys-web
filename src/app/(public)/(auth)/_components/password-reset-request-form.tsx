'use client'
import { requestPasswordReset } from '@/common/actions/auth.action'
import { ApiError } from '@/common/classes/api-error.class'
import useResponse from '@/common/hooks/use-response'
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
import { useForm } from 'react-hook-form'
import {
	PasswordResetRequestSchema,
	passwordResetRequestSchema,
} from '../_schemas/password-reset-request.schema'

const PasswordResetRequestForm = () => {
	const response = useResponse()

	const form = useForm<PasswordResetRequestSchema>({
		resolver: zodResolver(passwordResetRequestSchema),
		defaultValues: {
			email: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({ email }: PasswordResetRequestSchema) => {
		await requestPasswordReset(email)
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Enlace enviado',
					description: 'Revisa tu bandeja de entrada',
				})

				form.reset()
			})
			.catch(response.error)
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
			</form>
		</Form>
	)
}

export default PasswordResetRequestForm
