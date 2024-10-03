import { cn } from '@/lib/utils'
import { ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<'fieldset'> & {
	legend: string
}

const Fieldset = forwardRef<HTMLFieldSetElement, Props>(
	({ legend, children, className, ...rest }: Readonly<Props>, ref) => {
		return (
			<section
				ref={ref}
				className={cn('grid w-full grid-cols-1 gap-2', className)}
				{...rest}>
				<h4 className='py-2 text-sm font-semibold'>{legend}</h4>
				{children}
			</section>
		)
	}
)

Fieldset.displayName = 'Fieldset'

export default Fieldset
