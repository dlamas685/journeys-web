import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().trim().min(1, 'El correo electrónico es requerido.'),
	password: z.string().trim().min(1, 'La contraseña es requerida.'),
	rememberMe: z.boolean().default(false),
})

export type LoginSchema = z.infer<typeof loginSchema>
