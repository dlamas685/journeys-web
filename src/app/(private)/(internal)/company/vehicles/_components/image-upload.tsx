'use client'
import { uploadImage } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

type Props = {
	endpoint: ApiEndpoints
	recordId: string
	maxSize?: number
	entity: string
}

const ImageUpload = ({
	endpoint,
	recordId,
	maxSize = 10 * 1024 * 1024,
	entity,
}: Readonly<Props>) => {
	const response = useResponse()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (!file) return

		if (file.size > maxSize) {
			toast.error(entity, {
				position: 'top-right',
				description: `El archivo seleccionado supera el tamaño máximo permitido de ${maxSize / 1024 / 1024} MB.`,
			})

			if (inputRef.current) {
				inputRef.current.value = ''
			}

			return
		}

		const img = new Image()
		const url = URL.createObjectURL(file)
		img.src = url

		img.onload = async () => {
			const width = img.width
			const height = img.height

			if (width < 400 || height < 400) {
				toast.error(entity, {
					position: 'top-right',
					description: 'La imagen debe tener al menos 400px por 400px.',
				})
				URL.revokeObjectURL(url)

				if (inputRef.current) {
					inputRef.current.value = ''
				}

				return
			}

			const formData = new FormData()

			formData.append('file', file)

			await uploadImage(endpoint, recordId, formData)
				.then(resp => {
					if (typeof resp !== 'boolean') {
						throw new ApiError(resp)
					}

					response.success({
						title: entity,
						description: 'La imagen se ha actualizado correctamente.',
					})
				})
				.catch(response.error)
				.finally(() => {
					if (inputRef.current) {
						inputRef.current.value = ''
					}
				})

			URL.revokeObjectURL(url)
		}
	}

	return (
		<Input
			ref={inputRef}
			className='h-10 cursor-pointer py-2.5'
			type='file'
			onChange={handleUpload}
			accept='image/png, image/jpeg, image/jpg'
		/>
	)
}

export default ImageUpload
