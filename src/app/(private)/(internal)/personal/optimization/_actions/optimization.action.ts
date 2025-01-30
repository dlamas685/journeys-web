'use server'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { BasicOptimizationModel } from '../_models'

const API_URL = process.env.API_URL

export const computeBasicOptimization = async (basicCriteria: any) => {
	try {
		const URL = `${API_URL}/${ApiEndpoints.BASIC_OPTIMIZATION}`

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(basicCriteria),
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		const result = (await response.json()) as BasicOptimizationModel

		return result
	} catch (error) {
		throw error
	}
}
