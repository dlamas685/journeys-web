import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DialogState {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

const state: StateCreator<
	DialogState,
	[['zustand/devtools', never]]
> = set => ({
	isOpen: false,
	setIsOpen: (isOpen: boolean) => set({ isOpen }, false, 'setIsOpen'),
})

export const useDialog = create<DialogState>()(devtools(state))
