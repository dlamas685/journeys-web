import { PASSWORD_REGEX } from '@/common/constants'
import { z } from 'zod'

export const passwordResetsSchema = z
	.object({
		token: z.string().uuid(),
		email: z.string().email(),
		password: z
			.string()
			.trim()
			.min(1, 'Por favor, ingresa tu nueva contraseña.')
			.regex(
				PASSWORD_REGEX,
				'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
			),
		confirm: z
			.string()
			.trim()
			.min(1, 'Por favor, confirma tu nueva contraseña.'),
	})
	.refine(data => data.password === data.confirm, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirm'],
	})

export type PasswordResetsSchema = z.infer<typeof passwordResetsSchema>
