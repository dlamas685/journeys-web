'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { ApiError } from '../classes/api-error.class'
import { ApiEndpoints, FilterTypes } from '../enums'
import type {
	ErrorModel,
	PaginatedResponseModel,
	QueryParamsModel,
} from '../models'
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
	id: string,
	updateModel: ReqModel,
	headers: HeadersInit = HEADERS,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${endpoint}/${id}`

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
	fallbackUrl: string,
	headers: HeadersInit = HEADERS,
	next?: NextFetchRequestConfig
) => {
	try {
		const token = await getServerToken()

		let url = `${API_URL}/${endpoint}?`

		if (queryParams.page) url += `page=${queryParams.page}&`
		if (queryParams.limit) url += `limit=${queryParams.limit}&`

		if (queryParams.filters) {
			queryParams.filters.forEach(filter => {
				url += `filters=${filter.field}:${filter.rule}${filter.type === FilterTypes.STRING ? '~' : ''}:${filter.type}:${filter.value}&`
			})
		}

		if (queryParams.sorts) {
			queryParams.sorts.forEach(sort => {
				url += `sorts=${sort.field}:${sort.direction}&`
			})
		}

		if (queryParams.logicalFilters) {
			queryParams.logicalFilters.forEach(logicalFilter => {
				logicalFilter.conditions.forEach(condition => {
					url += `logicalFilters=${logicalFilter.operator}:${condition.field}:${condition.rule}:${condition.type}:${condition.value}&`
				})
			})
		}

		url = url.slice(0, -1)

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

export const uploadImage = async (
	endpoint: ApiEndpoints,
	id: string,
	formData: FormData,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
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

export const removeImage = async (
	endpoint: ApiEndpoints,
	id: string,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
			method: 'DELETE',
			headers: {
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
