import { ActivityModel } from '@/common/models'
import { createContext, Dispatch, SetStateAction } from 'react'
import { Column } from '../_types/column.type'

export type DraggableTableContextValue = {
	activities: ActivityModel[]
	setActivities: Dispatch<SetStateAction<ActivityModel[]>>
	columns: Column[]
	wasOrdered: boolean
	setWasOrdered: Dispatch<SetStateAction<boolean>>
}

export const DraggableTableContext =
	createContext<DraggableTableContextValue | null>(null)
