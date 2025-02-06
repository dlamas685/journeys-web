import { z } from 'zod'
import { serviceSchema } from './service.schema'

export const secondStageFormSchema = z.object({
	services: z
		.array(serviceSchema)
		.min(5, 'Tiene que especificar al menos 5 servicios')
		.max(20, 'No puede especificar más de 20 servicios'),
})

export type SecondStageFormSchema = z.infer<typeof secondStageFormSchema>
