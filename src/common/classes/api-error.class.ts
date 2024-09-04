import { ErrorModel } from '../models'

export class ApiError extends Error {
	statusCode: number
	title: string
	error: string

	constructor(response: ErrorModel) {
		super(
			Array.isArray(response.message)
				? response.message.join(' ')
				: response.message
		)
		this.name = 'ApiError'
		this.statusCode = response.statusCode
		this.error = response.error
		this.title = this.getTitle()
	}

	private getTitle(): string {
		switch (this.statusCode) {
			case 400:
				return 'Solicitud no válida'
			case 401:
				return 'Acceso no autorizado'
			case 403:
				return 'Acceso denegado'
			case 404:
				return 'Recurso no encontrado'
			case 409:
				return 'Conflicto de datos'
			case 500:
				return 'Error del servidor'
			default:
				return 'Error desconocido'
		}
	}
}
