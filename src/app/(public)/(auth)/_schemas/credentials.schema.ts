import { z } from 'zod'

export const credentialsSchema = z.object({
	email: z.string().trim().min(1, 'El correo electrónico es requerido.'),
	password: z.string().trim().min(1, 'La contraseña es requerida.'),
	rememberMe: z.boolean().default(false),
})

export type CredentialsSchema = z.infer<typeof credentialsSchema>
