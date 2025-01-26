import { TimestampModel } from '@/common/models'
import { ShipmentModel } from './shipment.model'
import { VehicleModel } from './vehicle.model'

export interface ShipmentModelModel {
	shipments: ShipmentModel[]

	vehicles: VehicleModel[]

	globalEndTime?: TimestampModel

	globalStartTime?: TimestampModel
}
