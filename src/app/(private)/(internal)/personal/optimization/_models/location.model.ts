import { LatLngModel } from '@/common/models'
import { IntegerModel } from './integer.model'

export interface LocationModel {
	latLng: LatLngModel
	heading?: IntegerModel
}
