import { z } from 'zod'
import { upsertFormSchema as activityFormSchema } from '../../activity-templates/[id]/activity-manager/_schemas/upsert-form.schema'

export const activitiesFormSchema = z.object({
	activities: z.array(activityFormSchema).min(1),
})

export type ActivitiesFormSchema = z.infer<typeof activitiesFormSchema>
