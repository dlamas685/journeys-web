'use server'

import { getServerToken } from '@/common/actions/session.action'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { CreateRealTimeSession, RealTimeSession } from '../_models'

const API_URL = process.env.API_URL

const OPENAI_API_URL = process.env.OPENAI_API_URL

const HEADERS: HeadersInit = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
}

export const createRealTimeSession = async (
	endpoint: ApiEndpoints,
	createModel: CreateRealTimeSession,
	headers: HeadersInit = HEADERS
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

		const created = (await response.json()) as RealTimeSession

		return created
	} catch (error) {
		throw error
	}
}

export const negotiateSDP = async (clientSecret: string, sdp?: string) => {
	try {
		const baseUrl = `${OPENAI_API_URL}/realtime`

		const response = await fetch(`${baseUrl}`, {
			method: 'POST',
			body: sdp,
			headers: {
				Authorization: `Bearer ${clientSecret}`,
				'Content-Type': 'application/sdp',
			},
		})

		return await response.text()
	} catch (error) {
		throw new Error('Failed to negotiate SDP')
	}
}
