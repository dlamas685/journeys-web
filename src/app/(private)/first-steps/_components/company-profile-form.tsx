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
import { companyProfileSchema, CompanyProfileSchema } from '../_schemas'

const CompanyProfileForm = () => {
	const router = useRouter()

	const response = useResponse()

	const form = useForm<CompanyProfileSchema>({
		resolver: zodResolver(companyProfileSchema),
		defaultValues: {
			name: '',
			cuit: '',
			manager: '',
		},
	})

	const { isSubmitting } = form.formState

	const handleSubmit = async (companyProfile: CompanyProfileSchema) => {
		const user: UpdateUserModel = {
			userType: UserTypes.COMPANY,
			companyProfile,
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
				className='grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:gap-x-10 sm:gap-y-5 sm:px-2 md:px-4'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset className='flex flex-col gap-2 sm:gap-3'>
					<FieldsetLegend>Datos Empresariales</FieldsetLegend>
					<FieldsetContent>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											transparent
											muted={false}
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
									<FormControl>
										<InputMask
											muted={false}
											transparent
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
									<FormControl>
										<InputMask
											transparent
											muted={false}
											{...field}
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
							name='taxAddress'
							render={({ field }) => (
								<FormItem>
									<InputPlace
										transparent
										muted={false}
										value={field.value}
										placeholder='Buscar dirección fiscal (opcional)'
										searchPlaceholder='Ingresa tu dirección fiscal'
										onPlaceSelect={place => {
											field.onChange(place?.formatted_address)
										}}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='flex flex-col gap-2 sm:gap-3'>
					<FieldsetLegend>Datos del Responsable</FieldsetLegend>
					<FieldsetContent>
						<FormField
							control={form.control}
							name='manager'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											transparent
											muted={false}
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
									<FormControl>
										<InputMask
											transparent
											muted={false}
											{...field}
											placeholder='Ingresa su teléfono sin +54 (opcional)'
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
									<FormControl>
										<Input
											transparent
											muted={false}
											{...field}
											placeholder='Ingresa su correo electrónico (opcional)'
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
					className='col-span-full mt-2 w-full max-w-xs justify-self-center sm:mt-0 sm:max-w-[12.5rem]'
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

export default CompanyProfileForm
