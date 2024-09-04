import { z } from 'zod'

export const credentialsSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa tu dirección de correo electrónico.'),
	password: z.string().trim().min(1, 'Por favor, ingresa tu contraseña.'),
	rememberMe: z.boolean().default(false),
})

export type CredentialsSchema = z.infer<typeof credentialsSchema>
