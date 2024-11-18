import { searchFilterSchema } from '@/common/schemas'
import { z } from 'zod'

export const filterFormSchema = z.object({
	name: searchFilterSchema(),
	address: searchFilterSchema(),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>
