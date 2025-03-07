import { secondsToHHMM } from '@/common/utils'
import { format } from 'date-fns'
import { PresetsModel, SettingModel } from '../../optimization/_models'

export const toPresets = (setting: SettingModel) => {
	const presets: PresetsModel = {
		firstStage: {
			...setting.firstStage,
			global: {
				date: format(setting.firstStage.startDateTime, 'yyyy-MM-dd'),
				startTime: format(setting.firstStage.startDateTime, 'HH:mm'),
				endTime: format(setting.firstStage.endDateTime, 'HH:mm'),
			},
		},
		secondStage: {
			services: setting.secondStage.services.map(service => ({
				...service,
				duration: secondsToHHMM(service.duration),
			})),
		},
		thirdStage: setting.thirdStage
			? {
					costProfile: setting.thirdStage.costProfile,
					costModel: setting.thirdStage.costModel
						? {
								costPerHour: setting.thirdStage.costModel.costPerHour,
								costPerKilometer: setting.thirdStage.costModel.costPerKilometer,
								costPerTraveledHour:
									setting.thirdStage.costModel.costPerTraveledHour,
								fixedCost: setting.thirdStage.costModel.fixedCost,
							}
						: undefined,
					bounds: setting.thirdStage.bounds
						? {
								routeDistanceLimit:
									setting.thirdStage.bounds.routeDistanceLimit,
								routeDurationLimit: setting.thirdStage.bounds.routeDurationLimit
									? secondsToHHMM(setting.thirdStage.bounds.routeDurationLimit)
									: undefined,
								travelDurationLimit: setting.thirdStage.bounds
									.travelDurationLimit
									? secondsToHHMM(setting.thirdStage.bounds.travelDurationLimit)
									: undefined,
							}
						: undefined,
				}
			: undefined,
	}

	return presets
}
