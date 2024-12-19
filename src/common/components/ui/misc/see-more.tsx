'use client'
import { cn } from '@/lib/utils'
import { ComponentProps, useEffect, useRef, useState } from 'react'

type Props = Omit<ComponentProps<'p'>, 'children'> & {
	children: string
	lines?: 1 | 2 | 3 | 4 | 5 | 6
}

const SeeMore = ({
	children,
	className,
	lines = 3,
	...rest
}: Readonly<Props>) => {
	const [seeMore, setSeeMore] = useState<boolean>(false)
	const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
	const notesRef = useRef<HTMLSpanElement>(null)

	const toggleSeeMore = () => setSeeMore(!seeMore)

	useEffect(() => {
		if (notesRef.current) {
			const isOverflow =
				notesRef.current.scrollHeight > notesRef.current.offsetHeight
			setIsOverflowing(isOverflow)
		}
	}, [children])

	return (
		<p className={className} {...rest}>
			<span
				ref={notesRef}
				className={cn('overflow-hidden', {
					'line-clamp-1': !seeMore && lines === 1,
					'line-clamp-2': !seeMore && lines === 2,
					'line-clamp-3': !seeMore && lines === 3,
					'line-clamp-4': !seeMore && lines === 4,
					'line-clamp-5': !seeMore && lines === 5,
					'line-clamp-6': !seeMore && lines === 6,
					'line-clamp-none': seeMore,
				})}>
				{children}
			</span>
			{isOverflowing && (
				<span
					className='cursor-pointer text-sm text-orange-500'
					onClick={toggleSeeMore}>
					{seeMore ? 'Ver menos' : 'Ver más'}
				</span>
			)}
		</p>
	)
}

export default SeeMore
