'use server'

import { auth } from '@/auth'

/**
 *
 * @returns The token of the current session
 */
export const getServerToken = async () => {
	const session = await auth()
	return session?.token
}

/**
 *
 * @returns The user of the current session
 */
export const getServerUser = async () => {
	const session = await auth()
	return session?.user
}
