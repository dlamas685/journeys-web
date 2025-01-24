import { VisitRequestModel } from './visit-request.model'

export interface ShipmentModel {
	displayName?: string
	deliveries: VisitRequestModel[]
	pickups?: VisitRequestModel[]
}
