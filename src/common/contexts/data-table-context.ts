import {
	ColumnDef,
	RowSelectionState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import { createContext, Dispatch, SetStateAction } from 'react'
import { PaginationMetadataModel, QueryParamsModel } from '../models'

export type DataTableContextValue<TData = any, TValue = any> = {
	table: ReturnType<typeof useReactTable<TData>>
	metadata: PaginationMetadataModel
	columns: ColumnDef<TData, TValue>[]
	columnVisibility: VisibilityState
	setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
	rowSelection: RowSelectionState
	setRowSelection: Dispatch<SetStateAction<RowSelectionState>>
	queryParams: QueryParamsModel
}

export const DataTableContext = createContext<DataTableContextValue | null>(
	null
)
