'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { revalidateTags } from '@/common/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FleetModel } from '../../fleets/_models'
import {
	CostProfileModel,
	RoadmapOptimizationModel,
	SettingModel,
} from '../_models'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const findAllCostProfiles = async (
	fallbackUrl: string,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

		let url = `${API_URL}/${ApiEndpoints.COST_PROFILES}`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			next,
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (response.status === 400) {
				redirect(fallbackUrl)
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as CostProfileModel[]

		return found
	} catch (error) {
		throw error
	}
}

export const findAvailableRoadmapAssets = async (
	fromDate: string,
	toDate: string,
	fallbackUrl: string,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

		let url = `${API_URL}/${ApiEndpoints.AVAILABLE_ROADMAP_ASSETS}?fromDate=${fromDate}&toDate=${toDate}`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			next,
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (response.status === 400) {
				redirect(fallbackUrl)
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as FleetModel[]

		return found
	} catch (error) {
		throw error
	}
}

export const optimizeTours = async (
	settingModel: SettingModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIMIZATION_TOURS}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(settingModel),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const computed = (await response.json()) as RoadmapOptimizationModel

		return computed
	} catch (error) {
		throw error
	}
}
