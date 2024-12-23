'use client'
import { type ActivityModel } from '@/common/models'
import { memo, type ReactNode, useState } from 'react'
import { DraggableTableContext } from '../_context/draggable-table.context'
import { type Column } from '../_types/column.type'

type Props = {
	initialValue: ActivityModel[]
	children: ReactNode
	columns: Column[]
}

const DraggableTableProvider = ({
	initialValue,
	children,
	columns,
}: Readonly<Props>) => {
	const [activities, setActivities] = useState<ActivityModel[]>(initialValue)

	const [wasOrdered, setWasOrdered] = useState<boolean>(false)

	return (
		<DraggableTableContext.Provider
			value={{
				activities,
				setActivities,
				columns,
				wasOrdered,
				setWasOrdered,
			}}>
			{children}
		</DraggableTableContext.Provider>
	)
}

export default memo(DraggableTableProvider)
