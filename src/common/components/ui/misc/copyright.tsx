import { cn } from '@/lib/utils'
import { ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<'p'>

const Copyright = forwardRef<HTMLParagraphElement, Props>(
	({ className, children, ...rest }: Readonly<Props>, ref) => {
		const year = new Date().getFullYear()

		return (
			<p
				ref={ref}
				className={cn('p-4 text-zinc-400 text-xs text-center', className)}
				{...rest}>
				&copy; {year} Journeys. Todos los derechos reservados.
				{children}
			</p>
		)
	}
)

Copyright.displayName = 'Copyright'

export default Copyright
