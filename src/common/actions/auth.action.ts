'use server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ApiEndpoints } from '../enums'
import { AuthModel, CredentialsModel, ResetPasswordModel } from '../models'

const API_URL = process.env.API_URL

export const loginWithCredentials = async (credentials: CredentialsModel) => {
	try {
		const cookiesStore = cookies()

		const URL = `${API_URL}/${ApiEndpoints.LOGIN}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Credenciales inválidas')
			} else {
				throw new Error('Algo salió mal')
			}
		}

		const auth = (await response.json()) as AuthModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: new Date(auth.expires * 1000),
		}

		cookiesStore.set('session.token', auth.accessToken, options)

		cookiesStore.set('session.user', JSON.stringify(auth.user), options)

		return auth
	} catch (error) {
		throw error
	}
}

export const loginWithGoogle = async () => {
	redirect(`${API_URL}/${ApiEndpoints.GOOGLE_LOGIN}`)
}

export const validateToken = async (token: string) => {
	try {
		const cookiesStore = cookies()

		const URL = `${API_URL}/${ApiEndpoints.TOKEN_VALIDATION}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({ token }),
		})

		if (!response.ok) {
			throw new Error('Token inválido')
		}

		const auth = (await response.json()) as AuthModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: new Date(auth.expires * 1000),
		}

		cookiesStore.set('session.token', auth.accessToken, options)

		cookiesStore.set('session.user', JSON.stringify(auth.user), options)

		return auth
	} catch (error) {
		throw error
	}
}

export const requestPasswordReset = async (email: string) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.PASSWORD_RESET_REQUEST}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('Usted no está registrado')
			}

			throw new Error('Algo salió mal')
		}

		return true
	} catch (error) {
		throw error
	}
}

export const resetPassword = async (resetPassword: ResetPasswordModel) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.PASSWORD_RESETS}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(resetPassword),
		})

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('El enlace ha expirado')
			}

			if (response.status === 404) {
				throw new Error('Usuario no encontrado')
			}

			throw new Error('Algo salió mal')
		}

		return true
	} catch (error) {
		throw error
	}
}
