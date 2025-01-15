import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { cloneElement, ReactElement, ReactNode } from 'react'

type Props = {
	children: ReactNode
	icon?: ReactNode
}

const FormTooltip = ({ children, icon }: Readonly<Props>) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{icon ? (
						cloneElement(icon as ReactElement, {
							className: 'hidden size-4 text-primary sm:block',
						})
					) : (
						<Info className='hidden size-4 text-primary sm:block' />
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
