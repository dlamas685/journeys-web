import { CostProfile } from '../_enums'

export interface CostProfileModel {
	id: CostProfile
	name: string
	description: string
	costPerKilometer: number
	costPerHour: number
	costPerTraveledHour: number
	fixedCost: number
	travelDurationMultiple: number
}
