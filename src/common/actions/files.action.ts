'use server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { ApiEndpoints } from '../enums'
import { ErrorModel, UserModel } from '../models'
import { getServerExpires, getServerToken } from './session.action'

const API_URL = process.env.API_URL

export const uploadUserImage = async (formData: FormData) => {
	try {
		const cookiesStore = cookies()

		const token = await getServerToken()

		const expires = await getServerExpires()

		const response = await fetch(`${API_URL}/${ApiEndpoints.FILES_PROFILES}`, {
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

export const removeUserImage = async () => {
	try {
		const cookiesStore = cookies()

		const token = await getServerToken()

		const expires = await getServerExpires()

		const response = await fetch(`${API_URL}/${ApiEndpoints.FILES_PROFILES}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
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
