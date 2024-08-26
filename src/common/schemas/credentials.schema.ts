import { z } from 'zod'

export const credentialsSchema = z.object({
	email: z.string().trim(),
	password: z.string().trim(),
	rememberMe: z.string().transform(value => value === 'true'),
})

export type CredentialsSchema = z.infer<typeof credentialsSchema>
