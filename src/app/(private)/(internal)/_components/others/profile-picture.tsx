'use client'
import { removeUserImage, uploadUserImage } from '@/common/actions/files.action'
import { ApiError } from '@/common/classes/api-error.class'
import useResponse from '@/common/hooks/use-response'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

type Props = {
	label: string
	imageUrl?: string | null
	imageAlt: string
	maxSize?: number
}

const ProfilePicture = ({
	imageUrl,
	imageAlt,
	label,
	maxSize = 10 * 1024 * 1024,
}: Readonly<Props>) => {
	const router = useRouter()

	const response = useResponse()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (!file) return

		if (file.size > maxSize) {
			toast.error('Imagen de perfil', {
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
				toast.error('Imagen de perfil', {
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

			await uploadUserImage(formData)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Imagen de perfil',
						description: 'La imagen de perfil se ha actualizado correctamente.',
					})

					router.refresh()
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

	const handleRemove = async () => {
		await removeUserImage()
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Imagen de perfil',
					description: 'La imagen de perfil se ha eliminado correctamente.',
				})
			})
			.catch(response.error)
	}

	return (
		<section className='grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-3.5'>
			<Avatar className='size-28 place-self-center rounded-3xl'>
				<AvatarImage src={imageUrl ?? ''} alt={imageAlt} />
				<AvatarFallback className='size-28 rounded-3xl bg-orange-500/10 font-secondary text-5xl text-orange-500'>
					{label}
				</AvatarFallback>
			</Avatar>
			<section className='flex flex-col gap-1.5'>
				<Label htmlFor='profile-picture'>Imagen de perfil</Label>

				<section className='flex items-center gap-2'>
					<Input
						ref={inputRef}
						className='h-10 cursor-pointer py-2.5'
						id='profile-picture'
						type='file'
						onChange={handleUpload}
						accept='image/png, image/jpeg, image/jpg'
					/>

					<Button
						variant='ghost'
						size='sm'
						className='h-9 text-destructive'
						disabled={!imageUrl}
						onClick={handleRemove}>
						Eliminar
					</Button>
				</section>

				<p className='text-xs text-gray-500'>
					*.png, *.jpg archivos de hasta 10 MB con al menos 400px por 400px
				</p>
			</section>
		</section>
	)
}

export default ProfilePicture
