import { cn } from '@/lib/utils'
import { type ComponentProps, type ReactNode, forwardRef } from 'react'

type FrameHeaderProps = ComponentProps<'header'> & {
	children: ReactNode
}

type FrameTitleProps = ComponentProps<'h1'> & {
	children: ReactNode
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type FrameGadgetsProps = ComponentProps<'section'> & {
	children: ReactNode
}

type FrameBodyProps = ComponentProps<'section'> & {
	children: ReactNode
}

type FrameFooterProps = ComponentProps<'footer'> & {
	children: ReactNode
}

type FrameProps = ComponentProps<'section'> & {
	children: ReactNode
	as?: 'section' | 'article' | 'aside'
}

const FrameHeader = forwardRef<HTMLHeadElement, FrameHeaderProps>(
	({ className, ...rest }: Readonly<FrameHeaderProps>, ref) => (
		<header
			ref={ref}
			className={cn(
				'grid grid-cols-1 gap-8 sm:flex sm:flex-row sm:justify-between',
				className
			)}
			{...rest}
		/>
	)
)

FrameHeader.displayName = 'FrameHeader'

const FrameTitle = forwardRef<HTMLHeadingElement, FrameTitleProps>(
	({ as = 'h1', className, ...rest }: Readonly<FrameTitleProps>, ref) => {
		const Tag = as

		return (
			<Tag
				ref={ref}
				className={cn(
					{
						'mt-1 text-center font-primary text-xl font-semibold sm:static sm:mt-0 sm:inline-block sm:text-left sm:text-2xl':
							as === 'h1',
					},
					className
				)}
				{...rest}
			/>
		)
	}
)

FrameTitle.displayName = 'FrameBody'

const FrameGadgets = forwardRef<HTMLDivElement, FrameGadgetsProps>(
	({ className, ...rest }: Readonly<FrameGadgetsProps>, ref) => (
		<section
			ref={ref}
			className={cn('flex flex-wrap justify-center gap-1 sm:gap-2', className)}
			{...rest}
		/>
	)
)

FrameGadgets.displayName = 'FrameGadgets'

const FrameBody = forwardRef<HTMLDivElement, FrameBodyProps>(
	({ className, ...rest }: Readonly<FrameBodyProps>, ref) => (
		<section
			ref={ref}
			className={cn('flex flex-grow flex-col gap-4', className)}
			{...rest}
		/>
	)
)

FrameBody.displayName = 'FrameBody'

const FrameFooter = forwardRef<HTMLDivElement, FrameFooterProps>(
	({ className, ...rest }: Readonly<FrameFooterProps>, ref) => (
		<footer ref={ref} className={cn('', className)} {...rest} />
	)
)

FrameFooter.displayName = 'FrameFooter'

const Frame = forwardRef<HTMLDivElement, FrameProps>(
	({ className, as = 'section', ...rest }: Readonly<FrameProps>, ref) => {
		const Tag = as

		return (
			<Tag
				ref={ref}
				className={cn(
					'flex w-full flex-grow flex-col gap-5 p-0 sm:gap-8',
					className
				)}
				{...rest}
			/>
		)
	}
)

Frame.displayName = 'Frame'

export { Frame, FrameBody, FrameFooter, FrameGadgets, FrameHeader, FrameTitle }
