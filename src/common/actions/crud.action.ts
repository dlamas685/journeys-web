'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { ApiError } from '../classes/api-error.class'
import { ApiEndpoints, Pathnames } from '../enums'
import { ErrorModel, PaginatedResponseModel, QueryParamsModel } from '../models'
import { revalidateTags } from '../utils'
import { getServerToken } from './session.action'

const API_URL = process.env.API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const create = async <ReqModel, ResModel>(
	endpoint: ApiEndpoints,
	createModel: ReqModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${endpoint}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(createModel),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const created = (await response.json()) as ResModel

		return created
	} catch (error) {
		throw error
	}
}

export const update = async <ReqModel, ResModel>(
	endpoint: ApiEndpoints,
	updateModel: ReqModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${endpoint}`

		const response = await fetch(URL, {
			method: 'PATCH',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updateModel),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const updated = (await response.json()) as ResModel

		return updated
	} catch (error) {
		throw error
	}
}

export const findOne = async <ResModel>(
	endpoint: ApiEndpoints,
	id: string,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${endpoint}/${id}`

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

		const found = (await response.json()) as ResModel

		return found
	} catch (error) {
		throw error
	}
}

export const findAll = async <ResModel>(
	endpoint: ApiEndpoints,
	queryParams: QueryParamsModel,
	redirectUrl: Pathnames,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

		const params = new URLSearchParams()

		if (queryParams.page) params.set('page', queryParams.page.toString())

		if (queryParams.limit) params.set('limit', queryParams.limit.toString())

		if (queryParams.filters) {
			queryParams.filters.forEach(filter => {
				params.append('filters', JSON.stringify(filter))
			})
		}

		if (queryParams.sorts) {
			queryParams.sorts.forEach(sort => {
				params.append('sorts', JSON.stringify(sort))
			})
		}

		if (queryParams.logicalFilters) {
			queryParams.logicalFilters.forEach(logicalFilter => {
				params.append('logicalFilters', JSON.stringify(logicalFilter))
			})
		}

		const URL = `${API_URL}/${endpoint}?${params.toString()}`

		console.log(URL)

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

			if (response.status === 400) {
				redirect(redirectUrl)
			}

			throw new ApiError(error)
		}

		const found = (await response.json()) as PaginatedResponseModel<ResModel>

		return found
	} catch (error) {
		throw error
	}
}

export const remove = async (
	endpoint: ApiEndpoints,
	id: string,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${endpoint}/${id}`

		const response = await fetch(URL, {
			method: 'DELETE',
			headers: {
				...headers,
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
