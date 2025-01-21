import { IntegerModel } from './integer.model'
import { LatLngModel } from './lat-lng.model'

export interface LocationModel {
	latLng: LatLngModel
	heading?: IntegerModel
}
