'use client'
import { remove } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Button } from '@/components/ui/button'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import { ComponentProps, Dispatch, SetStateAction } from 'react'

type Props = ComponentProps<typeof Button> & {
	recordId: string
	endpoint: ApiEndpoints
	title?: string
	description?: string
	setAlertOpen: Dispatch<SetStateAction<boolean>>
}

const EraserButton = ({
	endpoint,
	recordId,
	title = 'Eliminar registro',
	description = 'Registro eliminado correctamente.',
	setAlertOpen,
	...rest
}: Readonly<Props>) => {
	const response = useResponse()
	const setLoading = useLoading(state => state.setLoading)
	const isLoading = useLoading(state => state.loading)

	const handleRemove = async () => {
		setLoading(true)

		await remove(endpoint, recordId)
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}

				response.success({
					title,
					description,
				})

				setAlertOpen(false)
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Button type='button' {...rest} onClick={handleRemove}>
			{isLoading ? (
				<LoaderCircle className='mr-1 size-4 animate-spin' />
			) : (
				<CircleCheck className='mr-1 size-4' />
			)}
			Continuar
		</Button>
	)
}

export default EraserButton
