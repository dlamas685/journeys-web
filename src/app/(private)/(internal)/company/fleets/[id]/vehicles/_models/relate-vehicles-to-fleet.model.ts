import { RelationOperations } from '../../../_enums/relation-operations.enum'

export interface RelateVehiclesToFleetModel {
	vehicleIds: string[]
	operation?: RelationOperations
}
