import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import { cloneElement, ReactElement, ReactNode } from 'react'

type Props = {
	className?: string
	children: ReactNode
	icon?: ReactNode
}

const FormTooltip = ({ children, icon, className }: Readonly<Props>) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{icon ? (
						cloneElement(icon as ReactElement, {
							className: cn('hidden size-4 text-primary sm:block', className),
						})
					) : (
						<Info
							className={cn('hidden size-4 text-primary sm:block', className)}
						/>
					)}
				</TooltipTrigger>
				<TooltipContent className='bg-orange-100 font-secondary text-primary'>
					{typeof children === 'string' ? <p>{children}</p> : children}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default FormTooltip
