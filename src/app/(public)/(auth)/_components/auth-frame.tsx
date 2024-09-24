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
		<section className='flex w-full max-w-xs flex-col items-center gap-1 sm:max-w-md md:max-w-sm'>
			<h1 className='font-secondary text-xl font-semibold sm:text-2xl'>
				{title}
			</h1>
			<p className='max-w-sm text-center font-secondary text-sm text-foreground'>
				{description}
			</p>
			{children}
			<p className='mt-1 text-center font-secondary text-sm sm:mt-3'>
				{redirectText}
				<Button className='px-1' variant='link' asChild>
					<Link href={redirectTo}>{redirectLabel}</Link>
				</Button>
			</p>
		</section>
	)
}

export default AuthFrame
