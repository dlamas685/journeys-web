'use server'

import { notFound } from 'next/navigation'
import { ApiEndpoints } from '../enums'

const API_URL = process.env.API_URL

export const validateLink = async (token: string, email: string) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.LINK_VALIDATION}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token, email }),
		})

		if (!response.ok) {
			if (response.status === 401) {
				notFound()
			}

			throw new Error('Algo salió mal')
		}

		return true
	} catch (error) {
		throw error
	}
}
