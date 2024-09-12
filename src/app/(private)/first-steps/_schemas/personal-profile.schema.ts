import { MINIMUN_USER_AGE } from '@/common/constants'
import { calculateAge } from '@/common/utils'
import { z } from 'zod'

export const personalProfileSchema = z.object({
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
	phone: z.string().trim().optional(),
	address: z.string().trim().optional(),
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
			const date = new Date(`${year}-${month}-${day}`).toISOString()
			return date
		})
		.refine(
			value => calculateAge(value) > MINIMUN_USER_AGE,
			'Debes tener al menos 14 años para registrarte.'
		)
		.optional(),
})

export type PersonalProfileSchema = z.infer<typeof personalProfileSchema>
