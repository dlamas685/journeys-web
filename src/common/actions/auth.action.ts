'use server'
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ApiEndpoints } from '../enums'
import type {
	AuthModel,
	CreateUserModel,
	CredentialsModel,
	ErrorModel,
	ResetPasswordModel,
	UserModel,
} from '../models'

const API_URL = process.env.API_URL

export const loginWithCredentials = async (credentials: CredentialsModel) => {
	try {
		const cookiesStore = await cookies()

		const URL = `${API_URL}/${ApiEndpoints.LOGIN}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const auth = (await response.json()) as AuthModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'none',
			expires: new Date(auth.expires * 1000),
		}

		cookiesStore.set('session.token', auth.accessToken, options)

		cookiesStore.set('session.user', JSON.stringify(auth.user), options)

		cookiesStore.set('session.expires', auth.expires.toString(), options)

		return auth
	} catch (error) {
		throw error
	}
}

export const loginWithGoogle = async () => {
	redirect(`${API_URL}/${ApiEndpoints.GOOGLE_LOGIN}`)
}

export const validateAccessToken = async (token: string) => {
	try {
		const cookiesStore = await cookies()

		const URL = `${API_URL}/${ApiEndpoints.ACCESS_TOKEN_VALIDATION}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({ token }),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const auth = (await response.json()) as AuthModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'none',
			expires: new Date(auth.expires * 1000),
		}

		cookiesStore.set('session.token', auth.accessToken, options)

		cookiesStore.set('session.user', JSON.stringify(auth.user), options)

		cookiesStore.set('session.expires', auth.expires.toString(), options)

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
			const error = (await response.json()) as ErrorModel
			return error
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
			const error = (await response.json()) as ErrorModel
			return error
		}

		return true
	} catch (error) {
		throw error
	}
}

export const signUp = async (user: CreateUserModel) => {
	try {
		const cookiesStore = await cookies()

		const URL = `${API_URL}/${ApiEndpoints.SIGN_UP}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			console.error(error)
			return error
		}

		const auth = (await response.json()) as AuthModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'none',
			expires: new Date(auth.expires * 1000),
		}

		cookiesStore.set('session.token', auth.accessToken, options)

		cookiesStore.set('session.user', JSON.stringify(auth.user), options)

		cookiesStore.set('session.expires', auth.expires.toString(), options)

		return auth
	} catch (error) {
		throw error
	}
}

export const verifyEmail = async (token: string, email: string) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.EMAIL_VERIFICATION}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token, email }),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const user = (await response.json()) as UserModel

		return user
	} catch (error) {
		throw error
	}
}

export const logOut = async () => {
	try {
		const cookiesStore = await cookies()

		cookiesStore.delete('session.token')

		cookiesStore.delete('session.user')

		cookiesStore.delete('session.expires')

		redirect('/')
	} catch (error) {
		throw error
	}
}
