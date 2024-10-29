export const jsonToBase64 = (object: object) => {
	const json = JSON.stringify(object)
	return Buffer.from(json, 'utf-8').toString('base64')
}
