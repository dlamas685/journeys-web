'use client'

import { removeActivity } from '@/common/actions/activity-template.action'
import { ApiError } from '@/common/classes/api-error.class'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import SeeMore from '@/common/components/ui/misc/see-more'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import useResponse from '@/common/hooks/use-response'
import { ActivityModel } from '@/common/models'
import { convertToHHMM } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	rectSwappingStrategy,
	SortableContext,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CircleMinus, CircleX, ClipboardCheck, Grip } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTodoListContext } from '../_hooks/use-todo-list-context'

const TodoList = () => {
	const { data, setData, setWasOrdered } = useTodoListContext()

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (active.id !== over?.id) {
			setData(currentData => {
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
			<SortableContext items={data} strategy={rectSwappingStrategy}>
				<section className='grid h-full w-full grid-cols-1 gap-3 overflow-hidden md:grid-cols-2'>
					{data.map(item => (
						<Todo key={item.id} id={item.id} record={item} />
					))}
				</section>
			</SortableContext>
		</DndContext>
	)
}

type TodoProps = {
	id: string
	record: ActivityModel
}

const Todo = ({ id, record }: Readonly<TodoProps>) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id })

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
		<article
			ref={setNodeRef}
			style={style}
			className={cn(
				'grid grid-cols-[1fr_auto] gap-3 rounded-md bg-zinc-50 p-4',
				{
					'bg-orange-50 text-orange-500': isDragging,
				}
			)}>
			<section className='flex flex-col gap-1 text-sm'>
				<span className='flex items-center gap-1 font-secondary font-semibold'>
					<ClipboardCheck className='size-4' />
					{record.name}
				</span>
				<SeeMore className='font-secondary text-muted-foreground' lines={2}>
					{record.description}
				</SeeMore>
				{record.duration && (
					<span className='font-secondary text-muted-foreground'>
						{convertToHHMM(record.duration)}
					</span>
				)}
			</section>
			<section className='flex flex-col justify-between'>
				<Button
					{...attributes}
					{...listeners}
					type='button'
					size='icon'
					variant='ghost'
					aria-describedby={undefined}
					className='size-7 cursor-grab'>
					<Grip className='text-default-400 size-5' />
				</Button>
				<RemovalAlert
					triggerIcon={<CircleMinus className='size-5' />}
					triggerProps={{
						className: 'size-7',
						variant: 'ghost',
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
			</section>
		</article>
	)
}

export default TodoList
