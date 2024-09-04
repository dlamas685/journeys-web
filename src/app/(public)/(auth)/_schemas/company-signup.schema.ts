import { PASSWORD_REGEX } from '@/common/constants'
import { z } from 'zod'

export const companySignupSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, 'Por favor, ingresa tu razón social.')
			.max(255, 'La razón social es demasiado larga.'),
		cuit: z.string().trim().min(1, 'Por favor, ingresa tu CUIT.'),
		email: z
			.string()
			.trim()
			.min(1, 'Por favor, ingresa una dirección de correo electrónico.')
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

export type CompanySignupSchema = z.infer<typeof companySignupSchema>
