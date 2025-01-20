import { v4 as uuid } from 'uuid'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AdvancedWaypointActivityModel } from '../_models'

interface ActivitiesState {
	activities: AdvancedWaypointActivityModel[]
	setActivities: (activities: AdvancedWaypointActivityModel[]) => void
	updateActivity: (activities: AdvancedWaypointActivityModel) => void
	addActivity: () => void
	removeActivity: (activity: AdvancedWaypointActivityModel) => void
}

const state: StateCreator<
	ActivitiesState,
	[['zustand/devtools', never]]
> = set => ({
	activities: [],
	setActivities: (activities: AdvancedWaypointActivityModel[]) =>
		set({ activities }, false, 'setActivities'),
	updateActivity: (activity: AdvancedWaypointActivityModel) =>
		set(state => ({
			activities: state.activities.map(a =>
				a.id === activity.id ? activity : a
			),
		})),
	addActivity: () =>
		set(state => {
			const activity: AdvancedWaypointActivityModel = {
				id: uuid(),
			}
			return {
				activities: [...state.activities, activity],
			}
		}),
	removeActivity: (activity: AdvancedWaypointActivityModel) =>
		set(state => ({
			activities: state.activities.filter(a => a.id !== activity.id),
		})),
})

export const useActivities = create<ActivitiesState>()(devtools(state))
