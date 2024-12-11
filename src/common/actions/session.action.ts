'use server'

import { cookies } from 'next/headers'
import type { UserModel } from '../models'

/**
 *
 * @returns The token of the current session
 */
export const getServerToken = async () => {
	const token = (await cookies()).get('session.token')?.value

	return token
}

/**
 *
 * @returns The user of the current session
 */
export const getServerUser = async () => {
	const user = (await cookies()).get('session.user')?.value

	if (!user) {
		return undefined
	}

	return JSON.parse(user) as UserModel
}

export const getServerExpires = async () => {
	const expires = (await cookies()).get('session.expires')?.value

	return Number(expires)
}
