'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiEndpoints } from '@/common/enums'
import type {
	ActivityTemplateModel,
	CreateActivityModel,
	ErrorModel,
} from '@/common/models'
import { revalidateTags } from '@/common/utils'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.API_URL

export const createActivity = async (
	id: string,
	activity: CreateActivityModel,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.ACTIVITY_TEMPLATES}/${id}/${ApiEndpoints.ACTIVITIES}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(activity),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const updatedActivityTemplate =
			(await response.json()) as ActivityTemplateModel

		return updatedActivityTemplate
	} catch (error) {
		throw error
	}
}

export const removeActivity = async (
	id: string,
	activityId: string,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.ACTIVITY_TEMPLATES}/${id}/${ApiEndpoints.ACTIVITIES}/${activityId}`

		const response = await fetch(URL, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		return true
	} catch (error) {
		throw error
	}
}
