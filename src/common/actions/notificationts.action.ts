'use server'

import { revalidatePath } from 'next/cache'
import { ApiEndpoints } from '../enums'
import type { ErrorModel, MarkAsReadModel } from '../models'
import { revalidateTags } from '../utils'
import { getServerToken } from './session.action'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const markAsRead = async (
	markAsReadModel: MarkAsReadModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.NOTIFICATIONS_READ}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(markAsReadModel),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const updated = (await response.json()) as { updatedCount: number }

		return updated
	} catch (error) {
		throw error
	}
}
