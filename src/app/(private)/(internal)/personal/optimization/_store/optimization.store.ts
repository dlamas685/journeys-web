import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PresetsModel, ResultsModel } from '../_models'

interface OptimizationState {
	presets: PresetsModel
	results: ResultsModel
	setPresets: (presets: PresetsModel) => void
	setResults: (results: ResultsModel) => void
}

const state: StateCreator<
	OptimizationState,
	[['zustand/devtools', never]]
> = set => ({
	results: {
		basic: {},
	},
	setResults: (results: ResultsModel) =>
		set(
			state => ({
				...state,
				results: {
					basic: {
						...state.results.basic,
						...results.basic,
					},
				},
			}),
			false,
			'setResults'
		),
	presets: {
		basic: {},
	},
	setPresets: (presets: PresetsModel) =>
		set(
			state => ({
				...state,
				presets: {
					basic: {
						...state.presets.basic,
						...presets.basic,
					},
				},
			}),
			false,
			'setPresets'
		),
})

export const useOptimization = create<OptimizationState>()(
	devtools(
		persist(state, {
			name: 'optimization',
			serialize: state => JSON.stringify(state),
			deserialize: str => JSON.parse(str),
		})
	)
)
