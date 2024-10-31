import { createContext } from 'react'

type DialogContextType = {
	open: boolean
	setOpen: (open: boolean) => void
}

export const DialogContext = createContext<DialogContextType>({
	open: false,
	setOpen: () => {},
})
