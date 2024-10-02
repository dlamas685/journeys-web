import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	muted?: boolean
	transparent?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, muted = true, transparent, ...props }, ref) => {
		return (
			<input
				className={cn(
					'flex h-9 w-full rounded-md border border-input px-3 py-5 font-secondary text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					muted && 'border-none bg-muted',
					transparent && 'bg-transparent',
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = 'Input'

export { Input }
