export const base64ToJson = <T>(base64String: string) => {
	try {
		const json = Buffer.from(base64String, 'base64').toString('utf-8')
		return JSON.parse(json) as T
	} catch (error) {
		throw new Error('Invalid base64 string')
	}
}
