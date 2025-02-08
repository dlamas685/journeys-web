'use server'
import { getServerToken } from '@/common/actions/session.action'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { revalidateTags } from '@/common/utils'
import { revalidatePath } from 'next/cache'
import { BasicCriteriaModel, CriteriaModel, RouteModel } from '../_models'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const computeBasicOptimization = async (
	basicCriteria: BasicCriteriaModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIMIZATION_BASIC}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(basicCriteria),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const computed = (await response.json()) as RouteModel

		return [computed]
	} catch (error) {
		throw error
	}
}

export const computeAdvancedOptimization = async (
	criteria: CriteriaModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIMIZATION_ADVANCED}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(criteria),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const computed = (await response.json()) as RouteModel[]

		return computed
	} catch (error) {
		throw error
	}
}
