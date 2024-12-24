import { ActivityModel } from '@/common/models'
import { createContext, Dispatch, SetStateAction } from 'react'

export type TodoListContextValue = {
	data: ActivityModel[]
	setData: Dispatch<SetStateAction<ActivityModel[]>>
	wasOrdered: boolean
	setWasOrdered: Dispatch<SetStateAction<boolean>>
}

export const TodoListContext = createContext<TodoListContextValue | null>(null)
