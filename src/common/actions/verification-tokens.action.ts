'use server'

import { ApiEndpoints } from '../enums'

const API_URL = process.env.API_URL

export const validateLink = async (token: string, email: string) => {
	try {
		const searchParams = new URLSearchParams()

		searchParams.set('token', token)
		searchParams.set('email', email)

		const URL = `${API_URL}/${ApiEndpoints.LINK_VALIDATION}?${searchParams.toString()}`

		const response = await fetch(URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (!response.ok) {
			return false
		}

		return true
	} catch (error) {
		throw error
	}
}
