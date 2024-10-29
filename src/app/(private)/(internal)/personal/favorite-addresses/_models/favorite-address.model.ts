export interface FavoriteAddressModel {
	id: string
	userId: string
	address: string
	alias: string
	placeId: number | null
	latitude: number
	longitude: number
	createdAt: Date
	updatedAt: Date
}
