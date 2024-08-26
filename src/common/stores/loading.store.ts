import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LoadingState {
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
}

const state: StateCreator<
	LoadingState,
	[['zustand/devtools', never]]
> = set => ({
	isLoading: false,
	setIsLoading: (isLoading: boolean) =>
		set({ isLoading }, false, 'setIsLoading'),
})

export const useLoading = create<LoadingState>()(devtools(state))
