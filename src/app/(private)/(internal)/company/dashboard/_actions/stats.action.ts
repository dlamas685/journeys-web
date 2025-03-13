'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { notFound } from 'next/navigation'
import {
	CompanyStatsByMonthModel,
	CompanyStatsModel,
	TopDriversModel,
} from '../_models'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const getCompanyStats = async (
	next?: NextFetchRequestConfig,
	headers: HeadersInit = HEADERS
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.STATS_COMPANY}`

		const response = await fetch(URL, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			next,
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (error.statusCode === 404) {
				notFound()
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as CompanyStatsModel

		return found
	} catch (error) {
		throw error
	}
}

export const getCompanyStatsByMonth = async (
	year?: number,
	month?: number,
	next?: NextFetchRequestConfig,
	headers: HeadersInit = HEADERS
) => {
	try {
		const token = await getServerToken()

		console.log({
			year,
			month,
		})

		const URL = `${API_URL}/${ApiEndpoints.STATS_COMPANY_BY_MONTH}?year=${year}&month=${month}`

		const response = await fetch(URL, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			next,
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (error.statusCode === 404) {
				notFound()
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as CompanyStatsByMonthModel[]

		return found
	} catch (error) {
		throw error
	}
}

export const getCompanyTopDrivers = async (
	next?: NextFetchRequestConfig,
	headers: HeadersInit = HEADERS
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.STATS_COMPANY_TOP_DRIVERS}`

		const response = await fetch(URL, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			next,
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (error.statusCode === 404) {
				notFound()
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as TopDriversModel[]

		return found
	} catch (error) {
		throw error
	}
}
