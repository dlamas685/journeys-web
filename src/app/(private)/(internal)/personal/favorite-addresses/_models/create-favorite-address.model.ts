export interface CreateFavoriteAddressModel {
	alias: string
	address: string
	latitude?: number | null
	longitude?: number | null
	placeId?: string | null
}
