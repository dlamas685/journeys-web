import { Context, useContext } from 'react'
import {
	DraggableTableContext,
	type DraggableTableContextValue,
} from '../_context/draggable-table.context'

export const useDraggableTableContext = () => {
	const context = useContext(
		DraggableTableContext as Context<DraggableTableContextValue | null>
	)
	if (!context) {
		throw new Error(
			'useDataTableContext debe ser usado dentro de un DraggableTableProvider'
		)
	}
	return context
}
