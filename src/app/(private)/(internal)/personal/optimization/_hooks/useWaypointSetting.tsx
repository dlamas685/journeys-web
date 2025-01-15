import { Context, useContext } from 'react'
import {
	WaypointSettingContext,
	type WaypointSettingContextValue,
} from '../_contexts/WaypointSettingContext'

export const useWaypointSetting = () => {
	const context = useContext(
		WaypointSettingContext as Context<WaypointSettingContextValue | null>
	)
	if (!context) {
		throw new Error(
			'useWaypointSetting debe ser usado dentro de un WaypointSetting'
		)
	}
	return context
}
