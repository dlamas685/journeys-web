'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { revalidateTags } from '@/common/utils'
import { revalidatePath } from 'next/cache'
import { ChangeStatusModel, RoadmapModel } from '../_models'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const changeStatus = async (
	changeStatusModel: ChangeStatusModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.ROADMAP_STATUS}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(changeStatusModel),
		})

		console.log(response)

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const changed = (await response.json()) as RoadmapModel

		return changed
	} catch (error) {
		throw error
	}
}
