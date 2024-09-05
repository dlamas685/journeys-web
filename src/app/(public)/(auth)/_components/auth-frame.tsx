import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
	title: string
	description: string
	children: ReactNode
	redirectLabel: string
	redirectText: string
	redirectTo: string
}

const AuthFrame = ({
	title,
	description,
	children,
	redirectText,
	redirectLabel,
	redirectTo,
}: Readonly<Props>) => {
	return (
		<section className='flex flex-col items-center gap-1'>
			<h1 className='font-secondary font-semibold text-2xl'>{title} </h1>
			<p className='font-secondary max-w-sm text-center text-sm text-foreground'>
				{description}
			</p>
			{children}
			<p className='text-sm text-center font-secondary mt-3'>
				{redirectText}
				<Button className='px-1' variant='link' asChild>
					<Link href={redirectTo}>{redirectLabel}</Link>
				</Button>
			</p>
		</section>
	)
}

export default AuthFrame
