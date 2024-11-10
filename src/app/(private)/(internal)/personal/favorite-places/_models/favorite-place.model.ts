export interface FavoritePlaceModel {
	id: string
	userId: string
	name: string
	placeId: string
	address: string
	types: string[] | null
	iconUrl: string | null
	latitude: number
	longitude: number
	createdAt: Date
	updatedAt: Date
}
