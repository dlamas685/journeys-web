import { Context, useContext } from 'react'
import { DialogContext, DialogContextValue } from '../contexts/dialog-context'

export const useDialogContext = () => {
	const context = useContext(
		DialogContext as Context<DialogContextValue | null>
	)
	if (!context) {
		throw new Error('useDialog debe ser usado dentro de un DialogProvider')
	}
	return context
}
