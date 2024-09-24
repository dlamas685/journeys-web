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
				className='mt-3 flex w-full flex-col gap-3'
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

				<Button className='mt-2' type='submit' disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='mr-1 h-6 w-6 animate-spin' />
					) : null}
					Enviar enlace
				</Button>
			</form>
		</Form>
	)
}

export default PasswordResetRequestForm
