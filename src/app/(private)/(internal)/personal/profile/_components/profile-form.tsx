'use client'
import { updateProfile } from '@/common/actions/options.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import InputPlace from '@/common/components/ui/google/input-place'
import useResponse from '@/common/hooks/use-response'
import { UserModel } from '@/common/models'
import { UpdateUserModel } from '@/common/models/update-user.model'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import 'cleave.js/dist/addons/cleave-phone.ar'
import { format } from 'date-fns'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { profileSchema, ProfileSchema } from '../_schemas/profile.schema'

type Props = {
	user: UserModel
}

const ProfileForm = ({ user }: Readonly<Props>) => {
	const router = useRouter()
	const response = useResponse()

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: user.personalProfile?.firstName ?? '',
			lastName: user.personalProfile?.lastName ?? '',
			email: user.email,
			dni: user.personalProfile?.dni ?? undefined,
			birthDate: user.personalProfile?.birthDate
				? format(user.personalProfile?.birthDate, 'dd/MM/yyyy')
				: undefined,
			phone: user.personalProfile?.phone ?? undefined,
			address: user.personalProfile?.address ?? undefined,
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({ email, ...restValues }: ProfileSchema) => {
		const user: UpdateUserModel = {
			email,
			personalProfile: restValues,
		}

		await updateProfile(user)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Mi perfil',
					description: 'Tu perfil se ha actualizado correctamente.',
				})

				router.refresh()
			})
			.catch(response.error)
	}

	return (
		<Form {...form}>
			<form
				className='grid w-full max-w-sm grid-cols-1 gap-x-4 gap-y-2 sm:max-w-lg sm:grid-cols-2'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>
								Correo electrónico<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa tu dirección de correo electrónico'
									type='email'
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Nombre<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder='Ingresa tu nombre' type='text' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='lastName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Apellido<span className='text-destructive'>*</span>
							</FormLabel>

							<FormControl>
								<Input
									{...field}
									placeholder='Ingresa tu apellido'
									type='text'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='dni'
					render={({ field }) => (
						<FormItem>
							<FormLabel>DNI</FormLabel>
							<FormControl>
								<InputMask
									{...field}
									placeholder='Ingresa tu DNI'
									options={{
										numericOnly: true,
									}}
									maxLength={8}
									minLength={7}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='birthDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Fecha de nacimiento</FormLabel>
							<FormControl>
								<InputMask
									{...field}
									placeholder='Ingresa tu fecha de nacimiento'
									options={{
										date: true,
										numericOnly: true,
										datePattern: ['d', 'm', 'Y'],
										delimiter: '/',
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Teléfono</FormLabel>
							<FormControl>
								<InputMask
									{...field}
									type='text'
									placeholder='Ingresa tu teléfono sin +54'
									options={{
										phone: true,
										phoneRegionCode: 'AR',
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='address'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dirección</FormLabel>
							<InputPlace
								value={field.value}
								placeholder='Buscar dirección'
								searchPlaceholder='Ingresa tu dirección'
								onPlaceSelect={place => {
									field.onChange(place?.formatted_address)
								}}
							/>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className='col-span-full mt-2 w-full sm:mt-6'
					type='submit'
					disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='mr-1 h-6 w-6 animate-spin' />
					) : null}
					Guardar
				</Button>
			</form>
		</Form>
	)
}

export default ProfileForm
