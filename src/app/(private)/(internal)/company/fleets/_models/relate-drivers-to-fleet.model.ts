import { RelationOperations } from '../_enums/relation-operations.enum'

export interface RelateDriversToFleetModel {
	driverIds: string[]
	operation?: RelationOperations
}
