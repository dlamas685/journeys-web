import { cn } from '@/lib/utils'
import { type ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<'p'>

const Copyright = forwardRef<HTMLParagraphElement, Props>(
	({ className, children, ...rest }: Readonly<Props>, ref) => {
		const year = new Date().getFullYear()

		return (
			<p
				ref={ref}
				className={cn('p-4 text-center text-xs text-zinc-400', className)}
				{...rest}>
				&copy; {year} Journeys. Todos los derechos reservados.
				{children}
			</p>
		)
	}
)

Copyright.displayName = 'Copyright'

export default Copyright
