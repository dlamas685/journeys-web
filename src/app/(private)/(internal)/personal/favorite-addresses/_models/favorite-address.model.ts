import { LocationModel } from '@/common/models'

export interface FavoriteAddressModel {
	id: string
	userId: string
	placeId: string
	alias: string
	address: string
	name: string
	location: LocationModel

	createdAt: Date
	updatedAt: Date | null
}
