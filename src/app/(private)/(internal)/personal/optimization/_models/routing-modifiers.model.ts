import { TollPass } from '../_enums'
import { type VehicleInfoModel } from './vehicle-info.model'

export interface RouteModifiersModel {
	avoidFerries?: boolean
	avoidHighways?: boolean
	avoidTolls?: boolean
	vehicleInfo?: VehicleInfoModel
	tollPasses?: TollPass[]
}
