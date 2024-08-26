'use server'
import { signIn } from '@/auth'
import { CredentialsSignin, User } from 'next-auth'
import { ApiEndpoints } from '../enums'
import { CredentialsModel } from '../models'

const API_URL = process.env.API_URL

export const logIn = async (credentials: CredentialsModel) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.AUTH}/${ApiEndpoints.LOGIN}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		if (response.status === 401 || response.status === 404) {
			throw new CredentialsSignin('Credenciales incorrectas.')
		}

		const user = (await response.json()) as User

		return user
	} catch (error) {
		throw error
	}
}

export const authenticate = async (formData: FormData) => {
	try {
		await signIn('credentials', formData)
	} catch (error) {
		throw error
	}
}
