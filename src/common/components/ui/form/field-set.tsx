import { cn } from '@/lib/utils'
import { type ComponentProps, forwardRef } from 'react'

const Fieldset = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
	({ className, ...rest }, ref) => {
		return (
			<section
				ref={ref}
				className={cn('grid w-full grid-cols-1 gap-2', className)}
				{...rest}
			/>
		)
	}
)

Fieldset.displayName = 'Fieldset'

const FieldsetLegend = forwardRef<HTMLHeadingElement, ComponentProps<'h4'>>(
	({ className, ...rest }, ref) => {
		return (
			<h4
				ref={ref}
				className={cn('py-2 font-secondary text-sm font-semibold', className)}
				{...rest}
			/>
		)
	}
)

FieldsetLegend.displayName = 'FieldsetLegend'

const FieldsetContent = forwardRef<HTMLDivElement, ComponentProps<'section'>>(
	({ className, ...rest }, ref) => {
		return (
			<section
				ref={ref}
				className={cn('grid w-full grid-cols-1 gap-2', className)}
				{...rest}
			/>
		)
	}
)

FieldsetContent.displayName = 'FieldsetContent'

export { Fieldset, FieldsetContent, FieldsetLegend }
