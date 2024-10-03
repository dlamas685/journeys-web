'use client'
import { removeUserImage, uploadUserImage } from '@/common/actions/files.action'
import { ApiError } from '@/common/classes/api-error.class'
import useResponse from '@/common/hooks/use-response'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { ChangeEvent } from 'react'

type Props = {
	label: string
	imageUrl?: string | null
	imageAlt: string
}

const ProfilePicture = ({ imageUrl, imageAlt, label }: Readonly<Props>) => {
	const router = useRouter()

	const response = useResponse()

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (!file) {
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
		<section className='flex flex-col items-center gap-6 sm:flex-row sm:gap-3.5'>
			<Avatar className='size-28 rounded-full'>
				<AvatarImage src={imageUrl ?? ''} alt={imageAlt} />
				<AvatarFallback className='size-28 rounded-full bg-orange-500/10 font-secondary text-5xl text-orange-500'>
					{label}
				</AvatarFallback>
			</Avatar>
			<section className='flex flex-col gap-1.5'>
				<Label htmlFor='profile-picture'>Imagen de perfil</Label>

				<section className='flex items-center gap-2'>
					<Input
						className='h-10 cursor-pointer py-2.5'
						id='profile-picture'
						type='file'
						onChange={handleUpload}
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
