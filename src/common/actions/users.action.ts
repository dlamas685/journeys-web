'use server'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { ApiEndpoints } from '../enums'
import { ErrorModel, UserModel } from '../models'
import { UpdateUserModel } from '../models/update-user.model'
import {
	getServerExpires,
	getServerToken,
	getServerUser,
} from './session.action'

const API_URL = process.env.API_URL

export const update = async (updateUser: UpdateUserModel) => {
	try {
		const cookiesStore = cookies()

		const token = await getServerToken()

		const user = await getServerUser()

		const expires = await getServerExpires()

		const URL = `${API_URL}/${ApiEndpoints.USERS}/${user?.id}`

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
			sameSite: 'strict',
			expires: new Date(expires * 1000),
		}

		cookiesStore.set('session.user', JSON.stringify(updateUser), options)

		return updatedUser
	} catch (error) {
		throw error
	}
}
