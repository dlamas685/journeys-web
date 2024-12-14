import { LICENSE_NUMBER } from '@/common/constants'
import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	fleetId: z.string().uuid().optional(),
	name: z
		.string({
			message: 'El nombre es requerido',
		})
		.min(1, 'El nombre es requerido')
		.max(50, 'El nombre no puede tener más de 50 caracteres'),
	licenseNumber: z
		.string()
		.min(1, 'EL número de licencia es requerido')
		.regex(LICENSE_NUMBER, {
			message: 'El número de licencia debe tener 7 u 8 dígitos',
		}),
	notes: z.string().optional(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>
