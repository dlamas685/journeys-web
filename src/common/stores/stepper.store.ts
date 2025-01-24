import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StepperState {
	stepsCompleted: number[]
	setStepsCompleted: (stepsCompleted: number[]) => void
	currentStep: number
	setCurrent: (currentStep: number) => void
	handleNext: () => void
	handleBack: () => void
	handleFinish: () => void
	handleReset: () => void
}

const state: StateCreator<
	StepperState,
	[['zustand/devtools', never]]
> = set => ({
	currentStep: 1,
	setCurrent: (currentStep: number) =>
		set({ currentStep }, false, 'setCurrent'),
	stepsCompleted: [],
	setStepsCompleted: (stepsCompleted: number[]) =>
		set({ stepsCompleted }, false, 'setStepsCompleted'),
	handleNext: () =>
		set(
			state => ({
				currentStep: state.currentStep + 1,
				stepsCompleted: [...state.stepsCompleted, state.currentStep],
			}),
			false,
			'handleNext'
		),
	handleBack: () =>
		set(
			state => ({
				currentStep: state.currentStep - 1,
				stepsCompleted: [
					...state.stepsCompleted.filter(
						step => step !== state.currentStep - 1
					),
				],
			}),
			false,
			'handleBack'
		),
	handleFinish: () =>
		set(
			state => ({
				currentStep: -1,
				stepsCompleted: [...state.stepsCompleted, state.currentStep],
			}),
			false,
			'handleFinish'
		),

	handleReset: () =>
		set({ currentStep: 0, stepsCompleted: [] }, false, 'handleReset'),
})

export const useStepper = create<StepperState>()(devtools(state))
