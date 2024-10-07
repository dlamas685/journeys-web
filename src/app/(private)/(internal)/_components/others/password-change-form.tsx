'use client'
import { changePassword } from '@/common/actions/options.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPassword from '@/common/components/ui/form/input-password'
import useResponse from '@/common/hooks/use-response'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
	passwordChangeSchema,
	PasswordChangeSchema,
} from '../../_schemas/password-change.schema'

const PasswordChangeForm = () => {
	const response = useResponse()

	const form = useForm<PasswordChangeSchema>({
		resolver: zodResolver(passwordChangeSchema),
		defaultValues: {
			password: '',
			newPassword: '',
			confirm: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({
		password,
		newPassword,
	}: PasswordChangeSchema) => {
		await changePassword(password, newPassword)
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Seguridad',
					description: 'Tu contraseña ha sido actualizada correctamente.',
				})

				form.reset()
			})
			.catch(response.error)
	}

	return (
		<Form {...form}>
			<form
				className='grid w-full max-w-lg grid-cols-1 gap-3 sm:gap-6'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>
								Contraseña<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Ingresa tu contraseña actual'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>
								Nueva contraseña<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Ingresa tu nueva contraseña'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='confirm'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>
								Confirmar contraseña<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Repite tu nueva contraseña'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className='col-span-full mt-2 w-full justify-self-start sm:w-auto'
					type='submit'
					disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='mr-1 size-6 animate-spin' />
					) : (
						<Save className='mr-1 hidden size-5 sm:block' />
					)}
					Guardar
				</Button>
			</form>
		</Form>
	)
}

export default PasswordChangeForm
