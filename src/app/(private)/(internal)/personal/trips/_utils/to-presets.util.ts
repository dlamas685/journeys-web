import { secondsToHHMM } from '@/common/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CriteriaModel, PresetsModel } from '../../optimization/_models'

export const toPresets = (criteria: CriteriaModel) => {
	const presets: PresetsModel = {
		basic: {
			origin: criteria.basicCriteria.origin,
			destination: criteria.basicCriteria.destination,
			departure: {
				date: criteria.basicCriteria.departureTime,
				time: format(criteria.basicCriteria.departureTime, 'p', {
					locale: es,
				}),
			},
			travelMode: criteria.basicCriteria.travelMode,
			interestPoints: criteria.basicCriteria.interestPoints,
			trafficOption: criteria.basicCriteria.trafficOption,
			modifiers: {
				avoidTolls: criteria.basicCriteria.modifiers?.avoidTolls ?? false,
				avoidHighways: criteria.basicCriteria.modifiers?.avoidHighways ?? false,
				avoidFerries: criteria.basicCriteria.modifiers?.avoidFerries ?? false,
			},
		},

		advanced: criteria.advancedCriteria
			? {
					extraComputations: criteria.advancedCriteria.extraComputations,
					computeAlternativeRoutes:
						criteria.advancedCriteria.computeAlternativeRoutes,
					optimizeWaypointOrder:
						criteria.advancedCriteria.optimizeWaypointOrder,
					trafficModel: criteria.advancedCriteria.trafficModel,
					requestedReferenceRoutes:
						criteria.advancedCriteria.requestedReferenceRoutes?.at(0),
					interestPoints: criteria.advancedCriteria.interestPoints?.map(
						point => ({
							...point,
							activities: point.activities?.map(activity => ({
								...activity,
								description: activity.description ?? '',
								duration: secondsToHHMM(activity.duration),
							})),
						})
					),
				}
			: undefined,
	}

	return presets
}
