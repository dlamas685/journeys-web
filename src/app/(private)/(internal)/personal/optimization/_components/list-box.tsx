'use client'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import {
	Children,
	cloneElement,
	ComponentProps,
	forwardRef,
	ReactElement,
} from 'react'

type ListBoxProps = ComponentProps<'ul'> & {}

const ListBox = forwardRef<HTMLUListElement, ListBoxProps>(
	({ className, children, ...restProps }: Readonly<ListBoxProps>, ref) => {
		const childrenItems = Children.toArray(
			children
		) as ReactElement<ListBoxItemProps>[]

		return (
			<ul
				ref={ref}
				className={cn(
					'max-h-96 overflow-auto py-3 pr-2 font-secondary text-sm text-muted-foreground',
					className
				)}
				{...restProps}>
				{childrenItems.map((child, index) =>
					cloneElement(child, { key: index })
				)}
			</ul>
		)
	}
)

ListBox.displayName = 'ListBox'

const listBoxItemVariants = cva(
	'mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-muted-foreground p-3 transition-all',
	{
		variants: {
			isActive: {
				true: 'bg-orange-50',
			},
		},
		defaultVariants: {
			isActive: false,
		},
	}
)

type ListBoxItemProps = ComponentProps<'li'> &
	VariantProps<typeof listBoxItemVariants> & {}

const ListBoxItem = forwardRef<HTMLLIElement, ListBoxItemProps>(
	(
		{ children, className, isActive, ...restProps }: Readonly<ListBoxItemProps>,
		ref
	) => {
		return (
			<li
				ref={ref}
				className={cn(listBoxItemVariants({ isActive }), className)}
				{...restProps}>
				{children}
			</li>
		)
	}
)

ListBoxItem.displayName = 'ListBox'

export { ListBox, ListBoxItem }
