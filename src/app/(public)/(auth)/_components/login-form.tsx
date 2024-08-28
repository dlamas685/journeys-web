'use client'
import {
	loginWithCredentials,
	loginWithGoogle,
} from '@/common/actions/auth.action'
import InputPassword from '@/common/components/ui/form/input-password'
import GoogleIcon from '@/common/components/ui/icons/google-icon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm, useFormState } from 'react-hook-form'
import { toast } from 'sonner'
import {
	CredentialsSchema,
	credentialsSchema,
} from '../_schemas/credentials.schema'

const LoginForm = () => {
	const router = useRouter()

	const form = useForm<CredentialsSchema>({
		resolver: zodResolver(credentialsSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const { isSubmitting } = useFormState(form)

	const handleSubmit = async (values: CredentialsSchema) => {
		await loginWithCredentials(values)
			.then(() => {
				router.push('/home')
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
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputPassword {...field} placeholder='Ingresa tu contraseña' />
							</FormControl>
							<FormMessage className='max-w-sm' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='rememberMe'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className='font-normal'>Recordarme</FormLabel>
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='w-6 h-6 mr-1 animate-spin' />
					) : (
						<div className='w-6 h-6 mr-1' />
					)}
					Iniciar sesión
				</Button>

				<div className='grid grid-cols-[1fr_auto_1fr] items-center my-4'>
					<Separator />
					<span className='font-secondary text-sm font-extralight px-3'>
						O CONTINUAR CON
					</span>
					<Separator />
				</div>

				<Button
					variant='outline'
					type='button'
					onClick={async () => {
						await loginWithGoogle()
					}}>
					<GoogleIcon />
					<span className='ml-2'>Google</span>
				</Button>
			</form>
		</Form>
	)
}

export default LoginForm
