import { Maneuver, RouteLabel, Speed } from '../_enums'
import { LocationModel } from './location.model'

export interface RouteModel {
	id: string
	legs: LegModel[]
	routeLabels: RouteLabel[]
	travelAdvisory: RouteTravelAdvisoryModel
	localizedValues: RouteLocalizedValuesModel
	stops: StopModel[]
	passages: PassageModel[]
	distance: number
	duration: number
	staticDuration: number
	encodedPolyline: string
}

export interface LegModel {
	steps: StepModel[]
	startLocation: LocationModel
	endLocation: LocationModel
	localizedValues: LegLocalizedValues
	travelAdvisory: LegTravelAdvisoryModel
	distance: number
	duration: number
	staticDuration: number
	encodedPolyline: string
}

export interface LegLocalizedValues {
	distance: string
	staticDuration: string
}

export interface StepModel {
	startLocation: LocationModel
	endLocation: LocationModel
	localizedValues: LegLocalizedValues
	travelAdvisory: StepTravelAdvisoryModel
	navigationInstruction: NavigationInstructionModel
	encodedPolyline: string
}

export interface NavigationInstructionModel {
	instructions?: string
	maneuver?: Maneuver
}

export interface StepTravelAdvisoryModel {
	speedReadingIntervals: SpeedReadingIntervalModel[]
}

export interface LegTravelAdvisoryModel {
	tollInfo: TollInfoModel
	speedReadingIntervals: SpeedReadingIntervalModel[]
}

export interface SpeedReadingIntervalModel {
	startPolylinePointIndex: number
	endPolylinePointIndex: number
	speed: Speed
}

export interface TollInfoModel {
	estimatedPrice: MoneyModel[]
}

export interface MoneyModel {
	currencyCode: string
	units: string
	nanos: number
}

export interface RouteLocalizedValuesModel {
	distance: string
	duration: string
	staticDuration: string
}

export interface PassageModel {
	location: LocationModel
	address: string
	placeId: string
}

export interface StopModel {
	location: LocationModel
	activities: ActivityModel[]
	address: string
	placeId: string
	duration: number
}

export interface ActivityModel {
	id: string
	name: string
	duration: number
	description: string
}

export interface RouteTravelAdvisoryModel {
	tollInfo: TollInfoModel
	speedReadingIntervals: any[]
	fuelConsumptionMicroliters: string
	routeRestrictionsPartiallyIgnored: boolean
}
