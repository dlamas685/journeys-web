import type { FilterFieldModel } from '../models'
import { jsonToBase64 } from './json-to-base64.util'

export const fromFilterFormToQuery = (
	filterForm: FilterFieldModel[]
): string => {
	const query = jsonToBase64(filterForm)

	return query
}
