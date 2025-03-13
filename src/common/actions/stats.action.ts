'use server'

import { notFound } from 'next/navigation'
import { ApiError } from '../classes/api-error.class'
import { ApiEndpoints } from '../enums'
import { ErrorModel } from '../models'
import { getServerToken } from './session.action'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const getCompanyStats = async (
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
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

		const found = (await response.json()) as any

		return found
	} catch (error) {
		throw error
	}
}

export const getCompanyStatsByMonth = async (
	year?: number,
	month?: number,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

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

		const found = (await response.json()) as any

		return found
	} catch (error) {
		throw error
	}
}

export const getCompanyTopDrivers = async (
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
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

		const found = (await response.json()) as any

		return found
	} catch (error) {
		throw error
	}
}
