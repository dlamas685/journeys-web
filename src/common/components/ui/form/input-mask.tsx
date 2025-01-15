import { cn } from '@/lib/utils'
import Cleave from 'cleave.js/react'
import { Props } from 'cleave.js/react/props'
import { ComponentClass, ForwardedRef, forwardRef } from 'react'

type InputMaskProps = Props & {
	muted?: boolean
	transparent?: boolean
}

const handleRef = (
	internalRef: any,
	externalRef: ForwardedRef<ComponentClass<Props, any>>
) => {
	if (typeof externalRef === 'function') {
		externalRef(internalRef)
	} else if (externalRef) {
		externalRef.current = internalRef
	}
}

const InputMask = forwardRef<typeof Cleave, InputMaskProps>(
	(
		{ className, muted = true, transparent, ...rest }: Readonly<InputMaskProps>,
		ref
	) => {
		return (
			<Cleave
				htmlRef={i => handleRef(i, ref)}
				className={cn(
					'flex h-9 w-full rounded-md border border-input px-3 py-5 font-secondary text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					muted && 'border-none bg-muted',
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
