'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CircleArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ComponentProps, type MouseEvent, type ReactNode } from 'react'

type Props = ComponentProps<typeof Button> & {
	icon?: ReactNode
	backUrl?: string
}

const BackButton = ({
	icon,
	className,
	backUrl,
	onClick,
	...rest
}: Readonly<Props>) => {
	const router = useRouter()

	const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
		if (backUrl) {
			router.push(backUrl)
			onClick && onClick(event)
			return
		}

		router.back()
		onClick && onClick(event)
	}

	return (
		<Button
			type='button'
			size='icon'
			variant='ghost'
			className={cn(className)}
			onClick={event => handleBack(event)}
			{...rest}>
			{icon ?? <CircleArrowLeft className='size-4' />}
		</Button>
	)
}

export default BackButton
