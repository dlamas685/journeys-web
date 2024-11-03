export interface FavoriteAddressModel {
	id: string
	userId: string
	address: string
	alias: string
	placeId: string | null
	latitude: number | null
	longitude: number | null
	createdAt: Date
	updatedAt: Date
}
