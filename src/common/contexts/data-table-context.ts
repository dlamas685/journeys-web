import {
	useReactTable,
	type ColumnDef,
	type RowSelectionState,
	type VisibilityState,
} from '@tanstack/react-table'
import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { PaginationMetadataModel, QueryParamsModel } from '../models'

export type DataTableContextValue<TData = any, TValue = any> = {
	table: ReturnType<typeof useReactTable<TData>>
	metadata: PaginationMetadataModel
	columns: ColumnDef<TData, TValue>[]
	columnVisibility: VisibilityState
	setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
	rowSelection: RowSelectionState
	setRowSelection: Dispatch<SetStateAction<RowSelectionState>>
	queryParams: QueryParamsModel
	dependencies?: Record<string, object[]>
}

export const DataTableContext = createContext<DataTableContextValue | null>(
	null
)
