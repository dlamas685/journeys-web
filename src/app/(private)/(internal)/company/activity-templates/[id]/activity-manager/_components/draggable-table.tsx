'use client'
import { removeActivity } from '@/common/actions/activity-template.action'
import { ApiError } from '@/common/classes/api-error.class'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import useResponse from '@/common/hooks/use-response'
import { ActivityModel } from '@/common/models'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CircleMinus, CircleX, Grip } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useDraggableTableContext } from '../_hooks/use-draggable-table-context'

const DraggableTable = () => {
	const { activities, setActivities, columns, setWasOrdered } =
		useDraggableTableContext()

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (active.id !== over?.id) {
			setActivities(currentData => {
				const oldIndex = currentData.findIndex(item => item.id === active.id)
				const newIndex = currentData.findIndex(item => item.id === over?.id)
				return arrayMove(currentData, oldIndex, newIndex)
			})

			setWasOrdered(true)
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}>
			<SortableContext
				items={activities}
				strategy={verticalListSortingStrategy}>
				<div className='h-full w-full overflow-hidden'>
					<Table className='border-separate border-spacing-y-3 overflow-hidden font-secondary'>
						<TableHeader>
							<TableRow className='border-none hover:bg-inherit'>
								{columns.map(column => (
									<TableHead key={column.id} className='text-black'>
										{column.label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{activities.map(item => (
								<DraggableRow key={item.id} id={item.id} record={item} />
							))}
						</TableBody>
					</Table>
				</div>
			</SortableContext>
		</DndContext>
	)
}

type DraggableRowProps = {
	id: string
	record: ActivityModel
}

const DraggableRow = ({ id, record }: DraggableRowProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const response = useResponse()

	const params = useParams()

	const handleRemove = async () => {
		const activityTemplateId = params['id'] as string

		await removeActivity(activityTemplateId, record.id)
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Actividades',
					description: 'Actividad eliminada correctamente',
				})
			})
			.catch(response.error)
	}

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className='rounded-l-xl rounded-r-xl border-none bg-zinc-50 text-sm hover:bg-orange-50 hover:text-orange-500'>
			<TableCell className='rounded-l-xl'>
				<Button
					{...attributes}
					{...listeners}
					type='button'
					size='icon'
					variant='ghost'
					aria-describedby={undefined}
					className='size-6 cursor-grab'>
					<Grip className='text-default-400 size-4' />
				</Button>
			</TableCell>
			<TableCell>{record.name}</TableCell>
			<TableCell>{record.description}</TableCell>
			<TableCell>
				{record.duration ? `${record.duration} min` : 'N/D'}
			</TableCell>
			<TableCell className='rounded-r-xl'>
				<RemovalAlert
					triggerIcon={<CircleMinus className='size-4' />}
					triggerProps={{
						className: 'size-7',
						variant: 'destructive',
						size: 'icon',
						'aria-label': `Eliminar la actividad ${record.name}`,
						'aria-disabled': 'false',
					}}
					cancelIcon={<CircleX className='mr-1 size-4' />}
					description={
						<>
							¿Estás seguro de que deseas eliminar la actividad{' '}
							<b className='capitalize'>{record.name}</b>? Esta acción no se
							puede deshacer.
						</>
					}
					eraserButton={({ setOpen }) => (
						<EraserButton
							setAlertOpen={setOpen}
							onRemove={handleRemove}
							title='Actividades'
							description='Actividad eliminada correctamente.'
						/>
					)}
				/>
			</TableCell>
		</TableRow>
	)
}

export default DraggableTable
