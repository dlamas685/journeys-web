import { MINIMUM_USER_AGE } from '@/common/constants'
import { calculateAge } from '@/common/utils'
import { z } from 'zod'

export const profileSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa una dirección de correo electrónico.')
		.email('La dirección de correo electrónico no es válida.'),
	firstName: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa tu nombre.')
		.max(255, 'El nombre es demasiado largo.'),
	lastName: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa tu apellido.')
		.max(255, 'El apellido es demasiado largo.'),
	phone: z.string().optional(),
	address: z.string().optional(),
	dni: z
		.string()
		.min(7, 'El DNI no puede tener menos de 7 números')
		.max(8, 'El DNI no puede tener más de 8 números')
		.optional(),
	birthDate: z
		.string()
		.trim()
		.length(10, 'Por favor, ingresa tu fecha de nacimiento.')
		.transform(value => {
			const [day, month, year] = value.split('/')
			const date = new Date(
				parseInt(year),
				parseInt(month),
				parseInt(day)
			).toISOString()
			return date
		})
		.refine(
			value => calculateAge(value) > MINIMUM_USER_AGE,
			'Debes tener al menos 14 años para registrarte.'
		)
		.optional(),
})

export type ProfileSchema = z.infer<typeof profileSchema>
