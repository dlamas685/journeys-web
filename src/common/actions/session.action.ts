'use server'

import { cookies } from 'next/headers'
import { UserModel } from '../models'

/**
 *
 * @returns The token of the current session
 */
export const getServerToken = async () => {
	const token = cookies().get('session.token')?.value
	return token
}

/**
 *
 * @returns The user of the current session
 */
export const getServerUser = async () => {
	const user = cookies().get('session.user')?.value

	if (!user) {
		return null
	}

	return JSON.parse(user) as UserModel
}
