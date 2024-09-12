'use client'

import { signUp } from '@/common/actions/auth.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPassword from '@/common/components/ui/form/input-password'
import { Pathnames, UserTypes } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { CreatePersonalProfileModel, CreateUserModel } from '@/common/models'
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
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
	personalSignUpSchema,
	PersonalSignUpSchema,
} from '../_schemas/personal-sign-up.schema'

const PersonalSignUpForm = () => {
	const response = useResponse()
	const router = useRouter()

	const form = useForm<PersonalSignUpSchema>({
		resolver: zodResolver(personalSignUpSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirm: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({
		firstName,
		lastName,
		confirm,
		...rest
	}: PersonalSignUpSchema) => {
		const personalProfile: CreatePersonalProfileModel = {
			firstName,
			lastName,
		}

		const user: CreateUserModel = {
			...rest,
			userType: UserTypes.PERSONAL,
			personalProfile,
		}

		await signUp(user)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Registro completado',
					description:
						'Te has registrado con éxito. Revisa tu correo para verificar tu cuenta.',
				})

				router.push(`/${Pathnames.LOGIN}`)
			})
			.catch(response.error)
	}

	return (
		<Form {...form}>
			<form
				className='grid grid-cols-1 gap-3 w-full md:grid-cols-2'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder='Ingresa tu nombre' type='text' />
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='lastName'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa tu apellido'
									type='text'
								/>
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem className='col-span-full'>
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
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormControl>
								<InputPassword
									{...field}
									placeholder='Ingresa una contraseña'
								/>
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirm'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormControl>
								<InputPassword {...field} placeholder='Repite tu contraseña' />
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<Button
					className='col-span-full mt-2'
					type='submit'
					disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='w-6 h-6 mr-1 animate-spin' />
					) : null}
					Registrarse
				</Button>
			</form>
		</Form>
	)
}

export default PersonalSignUpForm
