'use client'

import { ApiError } from '@/common/classes/api-error.class'
import { UPDATE_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Badge } from '@/components/ui/badge'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { changeStatus } from '../_actions/roadmaps.action'
import { ROADMAP_STATUS, VALID_TRANSITIONS } from '../_constants'
import { RoadmapStatus } from '../_enums/roadmap-status.enum'
import { ChangeStatusModel, RoadmapModel } from '../_models'
import { changeStatusFormSchema, ChangeStatusFormSchema } from '../_schemas'

type Props = {
	record: RoadmapModel
}

const ChangeStatusForm = ({ record }: Readonly<Props>) => {
	const form = useForm<ChangeStatusFormSchema>({
		defaultValues: {
			id: record.id,
			status: record.status as unknown as RoadmapStatus,
		},
		resolver: zodResolver(changeStatusFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const status = ROADMAP_STATUS[record.status]

	const validTransitions = VALID_TRANSITIONS[record.status].map(status => ({
		label: ROADMAP_STATUS[status].label,
		value: status,
		className: ROADMAP_STATUS[status].className,
	}))

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, status }: ChangeStatusFormSchema) => {
		setLoading(true)

		const changeStatusModel: ChangeStatusModel = {
			id,
			status,
		}

		await changeStatus(changeStatusModel)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Hojas de Ruta',
					description:
						'El estado de la hoja de ruta ha sido actualizado correctamente.',
				})

				form.reset()
				setOpen(false)
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Form {...form}>
			<form
				id={UPDATE_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:grid-cols-1 sm:px-1'>
				<dl className='flex flex-col gap-2 font-secondary text-sm font-medium text-foreground'>
					<dt>Estado Actual</dt>
					<dd>
						<Badge className={status.className}>{status.label}</Badge>
					</dd>
				</dl>

				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem className='space-y-3'>
							<FormLabel>Nuevo Estado</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex flex-col space-y-1'>
									{validTransitions.map(transition => (
										<FormItem
											key={transition.value}
											className='flex items-center space-x-3 space-y-0'>
											<FormControl>
												<RadioGroupItem value={transition.value} />
											</FormControl>
											<FormLabel className='font-normal'>
												{transition.label}{' '}
												{transition.value === RoadmapStatus.DISMISSED &&
													'(este estado no se puede revertir)'}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default ChangeStatusForm
