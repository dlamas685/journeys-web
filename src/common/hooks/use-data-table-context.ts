import { Context, useContext } from 'react'
import {
	DataTableContext,
	type DataTableContextValue,
} from '../contexts/data-table-context'

export const useDataTableContext = <TData, TValue = any>() => {
	const context = useContext(
		DataTableContext as Context<DataTableContextValue<TData, TValue> | null>
	)
	if (!context) {
		throw new Error(
			'useDataTableContext debe ser usado dentro de un DataTableProvider'
		)
	}
	return context
}
