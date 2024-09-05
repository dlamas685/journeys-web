'use client'
import { CircleCheckBig, ServerCrash } from 'lucide-react'
import { ExternalToast, toast } from 'sonner'
import { ApiError } from '../classes/api-error.class'

const useResponse = () => {
	const error = (error: unknown, externalToast?: ExternalToast) => {
		const { duration, description, position, ...rest } = externalToast ?? {}

		if (error instanceof ApiError) {
			toast.error(error.title, {
				duration: duration ?? 3000,
				description: description ?? error.message,
				position: position ?? 'top-right',
				icon: <ServerCrash />,
				...rest,
			})
			return
		}

		toast.error('Error', {
			duration: duration ?? 3000,
			description: description ?? 'Algo salio mal.',
			position: position ?? 'top-right',
			icon: <ServerCrash />,
			...rest,
		})
	}

	const success = (externalToast?: ExternalToast & { title?: string }) => {
		const {
			duration,
			title = 'Enhorabuena',
			description = 'Todo salio bien.',
			position,
			...rest
		} = externalToast ?? {}

		toast.success(title, {
			dismissible: true,
			description,
			position: position ?? 'top-right',
			icon: <CircleCheckBig />,
			...rest,
		})
	}

	return {
		error,
		success,
	}
}

export default useResponse
