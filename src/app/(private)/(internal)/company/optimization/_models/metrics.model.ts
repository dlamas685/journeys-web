export interface MetricsModel {
	performedServiceCount: number
	travelDuration: number
	visitDuration: number
	travelDistanceMeters: number
	totalFixedCost?: number
	totalCostPerHour?: number
	totalCostPerKilometer?: number
	totalCostPerTraveledHour?: number
	totalCost?: number
}
