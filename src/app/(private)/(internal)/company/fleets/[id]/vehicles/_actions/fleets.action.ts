'use server'
import { getServerToken } from '@/common/actions/session.action'
import { ApiEndpoints } from '@/common/enums'
import { ErrorModel } from '@/common/models'
import { revalidateTags } from '@/common/utils'
import { revalidatePath } from 'next/cache'
import { FleetModel } from '../../../_models'
import { RelateVehiclesToFleetModel } from '../_models/relate-vehicles-to-fleet.model'

const API_URL = process.env.API_URL

export const relateVehiclesToFleet = async (
	id: string,
	relateVehiclesToFleetModel: RelateVehiclesToFleetModel,
	tags?: string[]
) => {
	try {
		const token = await getServerToken()

		const URL = `${API_URL}/${ApiEndpoints.FLEETS}/${id}/${ApiEndpoints.VEHICLE_RELATIONS}`

		const response = await fetch(URL, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(relateVehiclesToFleetModel),
		})

		console.log({ API_URL, URL })

		if (!response.ok) {
			const error = (await response.json()) as ErrorModel
			return error
		}

		tags ? revalidateTags(tags) : revalidatePath('/')

		const fleet = (await response.json()) as FleetModel

		return fleet
	} catch (error) {
		throw error
	}
}
