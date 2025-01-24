import { ShipmentModel } from './shipment.model'
import { TimestampModel } from './timestamp.model'
import { VehicleModel } from './vehicle.model'

export interface ShipmentModelModel {
	shipments: ShipmentModel[]

	vehicles: VehicleModel[]

	globalEndTime?: TimestampModel

	globalStartTime?: TimestampModel
}
