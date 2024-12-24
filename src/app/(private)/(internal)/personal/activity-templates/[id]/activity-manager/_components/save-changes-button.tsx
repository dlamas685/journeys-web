'use client'
import { update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import {
	ActivityTemplateModel,
	UpdateActivityTemplateModel,
} from '@/common/models'
import { useLoading } from '@/common/stores/loading.store'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX, LoaderCircle, SaveAll } from 'lucide-react'
import { useState } from 'react'
import { useTodoListContext } from '../_hooks/use-todo-list-context'

type Props = {
	activityTemplateId: string
}

const SaveChangesButton = ({ activityTemplateId }: Readonly<Props>) => {
	const { wasOrdered, data, setWasOrdered } = useTodoListContext()

	const response = useResponse()

	const setLoading = useLoading(state => state.setLoading)
	const isLoading = useLoading(state => state.loading)

	const [open, setOpen] = useState<boolean>(false)

	const handleSave = async () => {
		setLoading(true)

		const activityTemplate: UpdateActivityTemplateModel = {
			activities: data,
		}

		await update<UpdateActivityTemplateModel, ActivityTemplateModel>(
			ApiEndpoints.ACTIVITY_TEMPLATES,
			activityTemplateId,
			activityTemplate
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Actividades',
					description:
						'Cambios guardados correctamente. El orden de las actividades ha sido actualizado.',
				})

				setWasOrdered(false)
				setOpen(false)
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant='outline' disabled={!wasOrdered}>
					<SaveAll className='mr-1 size-4' />
					Guardar
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Guardar cambios</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro de que deseas guardar los cambios? El orden de las
						actividades cambiará.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<CircleX className='mr-1 size-4' />
						Cancelar
					</AlertDialogCancel>
					<Button onClick={handleSave}>
						{isLoading ? (
							<LoaderCircle className='mr-1 size-4 animate-spin' />
						) : (
							<CircleCheck className='mr-1 size-4' />
						)}
						Confirmar
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default SaveChangesButton
