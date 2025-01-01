'use client'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import {
	Children,
	cloneElement,
	ComponentProps,
	forwardRef,
	isValidElement,
	ReactElement,
	SVGProps,
} from 'react'

import { Check } from 'lucide-react'
import { createContext, useContext } from 'react'
import SeeMore from '../misc/see-more'

type StepperContextValue = {
	layout: 'horizontal' | 'vertical'
}

const StepperContext = createContext<StepperContextValue>({
	layout: 'horizontal',
})

const useStepperContext = () => useContext(StepperContext)

const resolveComponentType = (childType: any) => {
	if (
		typeof childType === 'object' &&
		childType !== null &&
		'$$typeof' in childType &&
		childType.$$typeof === Symbol.for('react.lazy')
	) {
		return childType._init(childType._payload)
	}
	return childType
}

const stepperVariants = cva('flex justify-between gap-3', {
	variants: {
		layout: {
			horizontal: 'flex-row',
			vertical: 'flex-col',
		},
	},
	defaultVariants: {
		layout: 'horizontal',
	},
})

type StepperProps = ComponentProps<'ol'> &
	VariantProps<typeof stepperVariants> & {
		layout?: 'horizontal' | 'vertical'
		children: ReactElement<StepProps>[]
	}

const Stepper = forwardRef<HTMLOListElement, StepperProps>(
	(
		{
			children,
			className,
			layout = 'horizontal',
			...rest
		}: Readonly<StepperProps>,
		ref
	) => {
		const childrenItem = Children.toArray(children) as ReactElement<StepProps>[]

		return (
			<StepperContext.Provider value={{ layout }}>
				<ol
					ref={ref}
					className={cn(stepperVariants({ layout, className }))}
					{...rest}>
					{childrenItem.map((child, index) => {
						const isLast = index === childrenItem.length - 1
						const isBeforeLast = index === childrenItem.length - 2
						const count = index + 1

						return cloneElement(child, {
							key: index,
							...child.props,
						})
					})}
				</ol>
			</StepperContext.Provider>
		)
	}
)

Stepper.displayName = 'Stepper'

const stepVariants = cva('flex gap-2', {
	variants: {},
	defaultVariants: {},
})

type StepProps = Omit<ComponentProps<'li'>, 'children'> &
	VariantProps<typeof stepVariants> & {
		children: ReactElement<
			StepLabelProps | StepDescriptionProps | StepIndicatorProps
		>[]
		activeStep?: boolean
		completedStep?: boolean
	}

const Step = forwardRef<HTMLLIElement, StepProps>(
	(
		{
			children,
			className,
			activeStep,
			completedStep,
			...rest
		}: Readonly<StepProps>,
		ref
	) => {
		const { layout } = useStepperContext()
		const isHorizontal = layout === 'horizontal'

		let indicator: ReactElement | null = null
		let label: ReactElement | null = null
		let description: ReactElement | null = null

		Children.forEach(children, child => {
			if (!isValidElement(child)) return

			const childType = child.type

			const resolvedType = resolveComponentType(childType)

			switch (resolvedType) {
				case StepIndicator:
					indicator = child
					break
				case StepLabel:
					label = child
					break
				case StepDescription:
					description = child
					break
				default:
					console.warn('Unknown component:', child.type)
			}
		})

		return (
			<li
				ref={ref}
				className={cn(stepVariants({ className }), {
					'flex-col items-center': isHorizontal,
				})}
				{...rest}>
				{!completedStep ? (
					indicator &&
					cloneElement(indicator as ReactElement, {
						variant: activeStep ? 'active' : 'default',
					})
				) : (
					<StepIndicator variant='completed'>
						<Check />
					</StepIndicator>
				)}
				<div className='flex flex-col gap-1 font-secondary'>
					{label &&
						cloneElement(label as ReactElement, {
							className: cn({ 'text-primary font-bold': activeStep }),
						})}
					{description}
				</div>
			</li>
		)
	}
)

Step.displayName = 'Step'

const stepIndicatorVariants = cva('flex', {
	variants: {
		variant: {
			default: 'bg-secondary text-secondary-foreground border-secondary',
			active: ' bg-white text-primary border-primary',
			completed: 'bg-primary text-white border-primary',
		},
		shape: {
			circle: 'rounded-full border border-2',
			square: 'rounded-md border border-2',
		},
	},
	defaultVariants: {
		shape: 'circle',
		variant: 'default',
	},
})

type StepIndicatorProps = Omit<ComponentProps<'div'>, 'children'> &
	VariantProps<typeof stepIndicatorVariants> & {
		children: ReactElement<SVGProps<SVGSVGElement>> | string
	}

const StepIndicator = forwardRef<HTMLDivElement, StepIndicatorProps>(
	(
		{
			className,
			children,
			shape,
			variant,
			...rest
		}: Readonly<StepIndicatorProps>,
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					stepIndicatorVariants({ shape, variant, className }),
					'flex size-10 items-center justify-center font-secondary text-base font-semibold'
				)}
				{...rest}>
				{children}
			</div>
		)
	}
)

StepIndicator.displayName = 'StepIndicator'

type StepLabelProps = Omit<ComponentProps<'span'>, 'children'> & {
	children: string
}

const StepLabel = forwardRef<HTMLSpanElement, StepLabelProps>(
	({ children, className, ...rest }: Readonly<StepLabelProps>, ref) => {
		const { layout } = useStepperContext()
		const isHorizontal = layout === 'horizontal'

		return (
			<span
				ref={ref}
				className={cn(
					'text-sm font-medium',
					{
						'text-center': isHorizontal,
					},
					className
				)}
				{...rest}>
				{children}
			</span>
		)
	}
)

StepLabel.displayName = 'StepLabel'

type StepDescriptionProps = Omit<ComponentProps<'p'>, 'children'> & {
	children: string
}

const StepDescription = forwardRef<HTMLParagraphElement, StepDescriptionProps>(
	({ children, className, ...rest }: Readonly<StepDescriptionProps>, ref) => {
		const { layout } = useStepperContext()
		const isHorizontal = layout === 'horizontal'

		return (
			<SeeMore
				ref={ref}
				className={cn(
					'max-w-56 text-sm text-muted-foreground',
					{
						'text-center': isHorizontal,
					},
					className
				)}
				{...rest}>
				{children}
			</SeeMore>
		)
	}
)

StepDescription.displayName = 'StepDescription'

export { Step, StepDescription, StepIndicator, StepLabel, Stepper }
