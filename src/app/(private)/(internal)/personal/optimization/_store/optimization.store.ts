import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PresetsModel, ResultsModel } from '../_models'

interface OptimizationState {
	presets?: PresetsModel
	results?: ResultsModel
	setPresets: (presets: PresetsModel) => void
	setResults: (results: ResultsModel) => void
}

const state: StateCreator<
	OptimizationState,
	[['zustand/devtools', never]]
> = set => ({
	setPresets: (presets: PresetsModel) =>
		set(
			state => ({
				...state,
				presets,
			}),
			false,
			'setPresets'
		),

	setResults: (results: ResultsModel) =>
		set(
			state => ({
				...state,
				results,
			}),
			false,
			'setResults'
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
