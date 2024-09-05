import { PASSWORD_REGEX } from '@/common/constants'
import { z } from 'zod'

export const personalSignupSchema = z
	.object({
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
		email: z
			.string()
			.trim()
			.min(1, 'Por favor, ingresa tu dirección de correo electrónico.')
			.email('La dirección de correo electrónico no es válida.'),
		password: z
			.string()
			.trim()
			.min(1, 'Por favor, ingresa una contraseña.')
			.regex(
				PASSWORD_REGEX,
				'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
			),
		confirm: z.string().trim().min(1, 'Por favor, confirma tu contraseña.'),
	})
	.refine(data => data.password === data.confirm, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirm'],
	})

export type PersonalSignupSchema = z.infer<typeof personalSignupSchema>
