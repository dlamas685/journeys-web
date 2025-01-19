import { v4 as uuid } from 'uuid'
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { WaypointActivityModel } from '../_models'

interface ActivitiesState {
	activities: WaypointActivityModel[]
	setActivities: (activities: WaypointActivityModel[]) => void
	updateActivity: (activities: WaypointActivityModel) => void
	addActivity: () => void
	removeActivity: (activity: WaypointActivityModel) => void
}

const state: StateCreator<
	ActivitiesState,
	[['zustand/devtools', never]]
> = set => ({
	activities: [],
	setActivities: (activities: WaypointActivityModel[]) =>
		set({ activities }, false, 'setActivities'),
	updateActivity: (activity: WaypointActivityModel) =>
		set(state => ({
			activities: state.activities.map(a =>
				a.id === activity.id ? activity : a
			),
		})),
	addActivity: () =>
		set(state => {
			const activity: WaypointActivityModel = {
				id: uuid(),
			}
			return {
				activities: [...state.activities, activity],
			}
		}),
	removeActivity: (activity: WaypointActivityModel) =>
		set(state => ({
			activities: state.activities.filter(a => a.id !== activity.id),
		})),
})

export const useActivities = create<ActivitiesState>()(devtools(state))
