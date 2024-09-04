import { z } from 'zod'

export const passwordResetRequestSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa tu dirección de correo electrónico.')
		.email('La dirección de correo electrónico no es válida.'),
})

export type PasswordResetRequestSchema = z.infer<
	typeof passwordResetRequestSchema
>
