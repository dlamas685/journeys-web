'use client'
import { updateProfile } from '@/common/actions/options.action'
import { ApiError } from '@/common/classes/api-error.class'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
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
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import 'cleave.js/dist/addons/cleave-phone.ar'
import { LoaderCircle, Save } from 'lucide-react'
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
			name: user.companyProfile?.name ?? '',
			email: user.email,
			cuit: user.companyProfile?.cuit ?? '',
			manager: user.companyProfile?.manager ?? '',
			managerEmail: user.companyProfile?.managerEmail ?? '',
			managerPhone: user.companyProfile?.managerPhone ?? undefined,
			phone: user.companyProfile?.phone ?? undefined,
			taxAddress: user.companyProfile?.taxAddress ?? undefined,
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async ({ email, ...restValues }: ProfileSchema) => {
		const user: UpdateUserModel = {
			email,
			companyProfile: restValues,
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
				className='grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-6'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset>
					<FieldsetLegend>Datos Empresariales</FieldsetLegend>
					<FieldsetContent className='grid-cols-2 gap-2 sm:gap-3'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<FormLabel>
										Correo electrónico
										<span className='text-destructive'>*</span>
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
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Razón social<span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Ingresa tu razón social'
											type='text'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='cuit'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										CUIT<span className='text-destructive'>*</span>
									</FormLabel>
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
							name='taxAddress'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dirección Fiscal</FormLabel>
									<FormControl>
										<InputPlace
											value={field.value}
											placeholder='Buscar dirección fiscal (opcional)'
											searchPlaceholder='Ingresa tu dirección fiscal'
											onPlaceSelect={place => {
												field.onChange(place?.formatted_address)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Separator orientation='vertical' />

				<Fieldset>
					<FieldsetLegend>Datos del Responsable</FieldsetLegend>
					<FieldsetContent className='flex flex-col gap-2 sm:gap-3'>
						<FormField
							control={form.control}
							name='manager'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Nombre completo <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Ingresa su nombre completo'
											type='text'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='managerPhone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Teléfono</FormLabel>

									<FormControl>
										<InputMask
											{...field}
											placeholder='Ingresa su teléfono sin +54 '
											type='text'
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
							name='managerEmail'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Correo electrónico</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Ingresa su correo electrónico'
											type='email'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Button
					className='col-span-full mt-2 w-full justify-self-start sm:mt-4 sm:w-auto'
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

export default ProfileForm
