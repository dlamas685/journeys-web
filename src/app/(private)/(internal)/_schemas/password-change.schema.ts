import { PASSWORD_REGEX } from '@/common/constants'
import { z } from 'zod'

export const passwordChangeSchema = z
	.object({
		password: z.string().min(1, 'Por favor, ingresa tu contraseña actual.'),
		newPassword: z
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
	.refine(data => data.newPassword === data.confirm, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirm'],
	})

export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>
