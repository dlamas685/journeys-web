import { z } from 'zod'
import { RoadmapStatus } from '../_enums/roadmap-status.enum'

export const changeStatusFormSchema = z.object({
	id: z.string().uuid(),
	status: z.nativeEnum(RoadmapStatus),
})

export type ChangeStatusFormSchema = z.infer<typeof changeStatusFormSchema>
