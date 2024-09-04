'use client'

import { resetPassword } from '@/common/actions/auth.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPassword from '@/common/components/ui/form/input-password'
import { Pathnames } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
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
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
	PasswordResetsSchema,
	passwordResetsSchema,
} from '../_schemas/password-resets.schema'

type Props = {
	token: string
	email: string
}

const PasswordResetsForm = ({ token, email }: Readonly<Props>) => {
	const router = useRouter()

	const response = useResponse()

	const form = useForm<PasswordResetsSchema>({
		resolver: zodResolver(passwordResetsSchema),
		defaultValues: {
			token,
			email,
			password: '',
			confirm: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({
		password,
		email,
		token,
	}: PasswordResetsSchema) => {
		await resetPassword({
			email,
			password,
			token,
		})
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}

				router.push(`/${Pathnames.LOGIN}`)

				response.success({
					title: 'Contraseña reestablecida',
					description: 'Inicia sesión con tu nueva contraseña.',
				})
			})
			.catch(response.error)
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
			</form>
		</Form>
	)
}

export default PasswordResetsForm
