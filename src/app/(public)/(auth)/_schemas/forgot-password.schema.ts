import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'El correo electrónico es requerido.')
		.email('El correo electrónico no es válido.'),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
