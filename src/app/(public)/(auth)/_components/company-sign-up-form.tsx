'use client'

import { signUp } from '@/common/actions/auth.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import InputPassword from '@/common/components/ui/form/input-password'
import { Pathnames, UserTypes } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { CreateUserModel } from '@/common/models'
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
	companySignUpSchema,
	CompanySignUpSchema,
} from '../_schemas/company-sign-up.schema'

const CompanySignUpForm = () => {
	const response = useResponse()
	const router = useRouter()

	const form = useForm<CompanySignUpSchema>({
		resolver: zodResolver(companySignUpSchema),
		defaultValues: {
			name: '',
			cuit: '',
			email: '',
			manager: '',
			password: '',
			confirm: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({
		email,
		password,
		confirm,
		...rest
	}: CompanySignUpSchema) => {
		const user: CreateUserModel = {
			email,
			password,
			userType: UserTypes.COMPANY,
			companyProfile: { ...rest },
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
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa tu razón social'
									type='text'
								/>
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='cuit'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputMask
									{...field}
									placeholder='Ingresa tu CUIT'
									type='text'
									options={{
										numericOnly: true,
										blocks: [2, 8, 1],
										delimiter: '-',
									}}
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
									placeholder='Ingresa una dirección de correo electrónico'
									type='email'
								/>
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='manager'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa el nombre del responsable'
									type='text'
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

export default CompanySignUpForm
