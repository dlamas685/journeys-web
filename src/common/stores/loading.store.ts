import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LoadingState {
	loading: boolean
	setLoading: (isLoading: boolean) => void
}

const state: StateCreator<
	LoadingState,
	[['zustand/devtools', never]]
> = set => ({
	loading: false,
	setLoading: (loading: boolean) => set({ loading }, false, 'setLoading'),
})

export const useLoading = create<LoadingState>()(devtools(state))
