export interface PaginatedResponseModel<T = any> {
	data: T[]
	meta: PaginationMetadataModel
}

export interface PaginationMetadataModel {
	total: number
	lastPage: number
	page: number
}
