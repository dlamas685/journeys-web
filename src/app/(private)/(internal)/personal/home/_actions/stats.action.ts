'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { notFound } from 'next/navigation'
import { StatsByMonthModel, StatsModel } from '../_models'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const getStats = async (
	next?: NextFetchRequestConfig,
	headers: HeadersInit = HEADERS
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.STATS}`

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

		const found = (await response.json()) as StatsModel

		return found
	} catch (error) {
		throw error
	}
}

export const getStatsByMonth = async (
	year?: number,
	month?: number,
	next?: NextFetchRequestConfig,
	headers: HeadersInit = HEADERS
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.STATS_BY_MONTH}?year=${year}&month=${month}`

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

		const found = (await response.json()) as StatsByMonthModel[]

		return found
	} catch (error) {
		throw error
	}
}
