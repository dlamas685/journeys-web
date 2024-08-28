import { PASSWORD_REGEX } from '@/common/constants'
import { z } from 'zod'

export const resetPasswordSchema = z
	.object({
		token: z.string().uuid(),
		email: z.string().email(),
		password: z
			.string()
			.regex(
				PASSWORD_REGEX,
				'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
			),
		confirm: z.string(),
	})
	.refine(data => data.password === data.confirm, {
		message: 'Las contraseñas no coinciden',
		path: ['confirm'],
	})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
