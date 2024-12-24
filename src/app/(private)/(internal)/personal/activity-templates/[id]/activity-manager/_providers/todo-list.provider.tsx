'use client'
import { type ActivityModel } from '@/common/models'
import { memo, type ReactNode, useState } from 'react'
import { TodoListContext } from '../_context/todo-list.context'

type Props = {
	initialValue: ActivityModel[]
	children: ReactNode
}

const TodoListProvider = ({ initialValue, children }: Readonly<Props>) => {
	const [activities, setActivities] = useState<ActivityModel[]>(initialValue)

	const [wasOrdered, setWasOrdered] = useState<boolean>(false)

	return (
		<TodoListContext.Provider
			value={{
				data: activities,
				setData: setActivities,
				wasOrdered,
				setWasOrdered,
			}}>
			{children}
		</TodoListContext.Provider>
	)
}

export default memo(TodoListProvider)
