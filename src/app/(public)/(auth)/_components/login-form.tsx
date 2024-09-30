'use client'
import {
	loginWithCredentials,
	loginWithGoogle,
} from '@/common/actions/auth.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPassword from '@/common/components/ui/form/input-password'
import GoogleIcon from '@/common/components/ui/icons/google-icon'
import { Pathnames } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
	CredentialsSchema,
	credentialsSchema,
} from '../_schemas/credentials.schema'

const LoginForm = () => {
	const router = useRouter()
	const response = useResponse()

	const form = useForm<CredentialsSchema>({
		resolver: zodResolver(credentialsSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async (values: CredentialsSchema) => {
		await loginWithCredentials(values)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				router.replace(`/${Pathnames.HOME}`)
			})
			.catch(response.error)
	}

	return (
		<Form {...form}>
			<form
				className='mt-3 grid w-full grid-cols-2 items-center gap-3'
				onSubmit={form.handleSubmit(handleSubmit)}>
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
						<FormItem className='col-span-1 flex flex-row items-center space-x-3 space-y-0'>
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

				<Button className='col-span-1' variant='link' asChild>
					<Link href={`/${Pathnames.PASSWORD_RESET_REQUEST}`}>
						¿Olvidaste tu contraseña?
					</Link>
				</Button>

				<Button className='col-span-full' type='submit' disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='mr-1 h-6 w-6 animate-spin' />
					) : null}
					Iniciar sesión
				</Button>

				<div className='col-span-full my-4 grid grid-cols-[1fr_auto_1fr] items-center'>
					<Separator />
					<span className='px-3 font-secondary text-sm font-extralight'>
						O CONTINUAR CON
					</span>
					<Separator />
				</div>

				<Button
					className='col-span-full'
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
