import { LICENSE_PLATE_PATTERN, VIN_PATTERN } from '@/common/constants'
import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	fleetId: z.string().uuid().optional(),
	licensePlate: z
		.string()
		.min(1, 'La placa del vehículo es requerida')
		.regex(LICENSE_PLATE_PATTERN, {
			message: 'La placa debe tener el formato AAA 123 o AA 123 AA',
		}),
	make: z.string().optional(),
	model: z.string().optional(),
	year: z
		.number()
		.max(new Date().getFullYear(), 'El año no puede ser mayor al actual')
		.optional(),
	vin: z
		.string()

		.regex(VIN_PATTERN, {
			message:
				'El VIN debe tener 17 caracteres alfanuméricos sin la letra I, O, Q',
		})
		.optional(),
	notes: z.string().optional(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>
