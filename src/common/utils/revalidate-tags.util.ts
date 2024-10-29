import { revalidateTag } from 'next/cache'

export const revalidateTags = (tags: string[]) => {
	tags.forEach(tag => {
		revalidateTag(tag)
	})
}
