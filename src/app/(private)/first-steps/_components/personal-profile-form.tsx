'use client'

import { updateProfile } from '@/common/actions/options.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import InputPlace from '@/common/components/ui/google/input-place'
import { Pathnames, UserTypes } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { UpdateUserModel } from '@/common/models/update-user.model'
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
import 'cleave.js/dist/addons/cleave-phone.ar'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { PersonalProfileSchema, personalProfileSchema } from '../_schemas'

const PersonalProfileForm = () => {
	const router = useRouter()
	const response = useResponse()

	const form = useForm<PersonalProfileSchema>({
		resolver: zodResolver(personalProfileSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async (personalProfile: PersonalProfileSchema) => {
		const user: UpdateUserModel = {
			userType: UserTypes.PERSONAL,
			personalProfile,
		}

		await updateProfile(user)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				router.push(`/${Pathnames.HOME}`)
			})
			.catch(response.error)
	}

	return (
		<Form {...form}>
			<form
				className='grid w-full grid-cols-1 gap-2 sm:gap-3'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									transparent
									muted={false}
									placeholder='Ingresa tu nombre'
									type='text'
								/>
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
							<FormControl>
								<Input
									{...field}
									transparent
									muted={false}
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
							<FormControl>
								<InputMask
									{...field}
									transparent
									muted={false}
									placeholder='Ingresa tu DNI (opcional)'
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
							<FormControl>
								<InputMask
									{...field}
									transparent
									muted={false}
									placeholder='Ingresa tu fecha de nacimiento (opcional)'
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
							<FormControl>
								<InputMask
									{...field}
									transparent
									muted={false}
									type='text'
									placeholder='Ingresa tu teléfono sin +54 (opcional)'
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
							<FormControl>
								<InputPlace
									transparent
									muted={false}
									value={field.value}
									placeholder='Buscar dirección (opcional)'
									searchPlaceholder='Ingresa tu dirección'
									onPlaceSelect={place => {
										field.onChange(place?.formatted_address)
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className='mt-3s col-span-full w-full max-w-xs justify-self-center sm:mt-2 sm:max-w-[12.5rem]'
					type='submit'
					disabled={isSubmitting}>
					{isSubmitting ? (
						<LoaderCircle className='mr-1 h-6 w-6 animate-spin' />
					) : null}
					Continuar
				</Button>
			</form>
		</Form>
	)
}

export default PersonalProfileForm
