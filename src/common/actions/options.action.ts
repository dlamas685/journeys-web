'use server'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ApiError } from '../classes/api-error.class'
import { ApiEndpoints } from '../enums'
import { ErrorModel, UserModel } from '../models'
import { UpdateUserModel } from '../models/update-user.model'
import { getServerExpires, getServerToken } from './session.action'

const API_URL = process.env.API_URL

export const updateProfile = async (updateUser: UpdateUserModel) => {
	try {
		const cookiesStore = await cookies()

		const token = await getServerToken()

		const expires = await getServerExpires()

		const URL = `${API_URL}/${ApiEndpoints.OPTIONS_PROFILE}`

		const response = await fetch(URL, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updateUser),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const updatedUser = (await response.json()) as UserModel

		const options: Partial<ResponseCookie> = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: new Date(expires * 1000),
		}

		cookiesStore.set('session.user', JSON.stringify(updatedUser), options)

		return updatedUser
	} catch (error) {
		throw error
	}
}

export const findProfile = async () => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIONS_PROFILE}`

		const response = await fetch(URL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel

			if (error.statusCode === 404) {
				notFound()
			}

			throw new ApiError(error)
		}

		const user = (await response.json()) as UserModel

		return user
	} catch (error) {
		throw error
	}
}

export const changePassword = async (password: string, newPassword: string) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIONS_SECURITY}`

		const response = await fetch(URL, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ password, newPassword }),
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

export const hasPassword = async () => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.OPTIONS_SECURITY_PASSWORD_EXISTS}`

		const response = await fetch(URL, {
			headers: {
				method: 'GET',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const hasPassword = (await response.json()) as boolean

		return hasPassword
	} catch (error) {
		throw error
	}
}
