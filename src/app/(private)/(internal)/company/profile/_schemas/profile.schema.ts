import { z } from 'zod'

export const profileSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa una dirección de correo electrónico.')
		.email('La dirección de correo electrónico no es válida.'),
	name: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa el nombre de tu empresa')
		.max(255, 'El nombre de la empresa es demasiado largo'),
	cuit: z.string().trim().length(13, 'El CUIT debe tener 9 números'),
	phone: z.string().trim().optional(),
	taxAddress: z.string().trim().optional(),
	manager: z
		.string()
		.trim()
		.min(1, 'Por favor, ingresa el nombre del responsable')
		.max(255, 'El nombre del responsable es demasiado largo'),
	managerEmail: z.preprocess(
		value => (value === '' ? undefined : value),
		z
			.string()
			.trim()
			.email('Por favor, ingresa una dirección de correo electrónico válida')
			.optional()
	),
	managerPhone: z.string().trim().optional(),
})

export type ProfileSchema = z.infer<typeof profileSchema>
