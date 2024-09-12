import { cn } from '@/lib/utils'
import { ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<'fieldset'> & {
	legend: string
}

const Fieldset = forwardRef<HTMLFieldSetElement, Props>(
	({ legend, children, className, ...rest }: Readonly<Props>, ref) => {
		return (
			<fieldset
				ref={ref}
				className={cn('grid grid-cols-1 gap-2 w-full', className)}
				{...rest}>
				<legend className='text-sm font-semibold py-2'>{legend}</legend>
				{children}
			</fieldset>
		)
	}
)

Fieldset.displayName = 'Fieldset'

export default Fieldset
