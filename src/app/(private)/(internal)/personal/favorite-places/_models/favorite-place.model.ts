import { LocationModel } from '@/common/models'

export interface FavoritePlaceModel {
	id: string
	userId: string
	name: string
	placeId: string
	address: string
	location: LocationModel
	types: string[]

	createdAt: Date
	updatedAt: Date | null
}
