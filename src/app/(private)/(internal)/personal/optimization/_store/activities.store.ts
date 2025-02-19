import { v4 as uuid } from 'uuid'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type AdvancedWaypointActivity } from '../_types'

interface ActivitiesState {
	activities: AdvancedWaypointActivity[]
	setActivities: (activities: AdvancedWaypointActivity[]) => void
	updateActivity: (activities: AdvancedWaypointActivity) => void
	addActivity: () => void
	removeActivity: (activity: AdvancedWaypointActivity) => void
}

const state: StateCreator<
	ActivitiesState,
	[['zustand/devtools', never]]
> = set => ({
	activities: [],
	setActivities: (activities: AdvancedWaypointActivity[]) =>
		set({ activities }, false, 'setActivities'),
	updateActivity: (activity: AdvancedWaypointActivity) =>
		set(state => ({
			activities: state.activities.map(a =>
				a.id === activity.id ? activity : a
			),
		})),
	addActivity: () =>
		set(state => {
			const activity: AdvancedWaypointActivity = {
				id: uuid(),
			}
			return {
				activities: [...state.activities, activity],
			}
		}),
	removeActivity: (activity: AdvancedWaypointActivity) =>
		set(state => ({
			activities: state.activities.filter(a => a.id !== activity.id),
		})),
})

export const useActivities = create<ActivitiesState>()(devtools(state))
