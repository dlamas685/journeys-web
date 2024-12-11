import type { QueryParamsModel } from '../models'
import { base64ToJson } from './base64-to-json.util'

export const decodeQuery = (query: string) => {
	try {
		const decodedQuery = base64ToJson<QueryParamsModel>(query)
		return decodedQuery
	} catch (error) {
		return null
	}
}
