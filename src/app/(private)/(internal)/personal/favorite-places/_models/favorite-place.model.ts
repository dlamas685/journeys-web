export interface FavoritePlaceModel {
	id: string
	userId: string
	name: string
	placeId: string
	address: string
	types: string[]
	iconUrl: string
	iconBackgroundColor: string
	latitude: number
	longitude: number
	createdAt: Date
	updatedAt: Date | null
}
