import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StepperState {
	stepsCompleted: number[]
	setStepsCompleted: (stepsCompleted: number[]) => void
	currentStep: number
	setCurrent: (currentStep: number) => void
}

const state: StateCreator<
	StepperState,
	[['zustand/devtools', never]]
> = set => ({
	currentStep: 0,
	setCurrent: (currentStep: number) =>
		set({ currentStep }, false, 'setCurrent'),
	stepsCompleted: [],
	setStepsCompleted: (stepsCompleted: number[]) =>
		set({ stepsCompleted }, false, 'setStepsCompleted'),
})

export const useStepper = create<StepperState>()(devtools(state))
