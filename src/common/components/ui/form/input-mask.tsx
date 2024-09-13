import { cn } from '@/lib/utils'
import Cleave from 'cleave.js/react'
import { Component, ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<typeof Cleave> & {
	muted?: boolean
	transparent?: boolean
}

const InputMask = forwardRef<Component<Props, any, any>, Props>(
	({ className, muted = true, transparent, ...rest }: Readonly<Props>, ref) => {
		return (
			<Cleave
				ref={ref}
				className={cn(
					'flex h-9 w-full border-input border rounded-md px-3 py-5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-secondary placeholder:font-secondary',
					muted && 'bg-muted border-none',
					transparent && 'bg-transparent',
					className
				)}
				{...rest}
			/>
		)
	}
)

InputMask.displayName = 'InputMask'

export default InputMask
