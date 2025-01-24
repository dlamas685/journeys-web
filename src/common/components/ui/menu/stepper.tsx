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

import { resolveComponentType } from '@/common/utils'
import { Check } from 'lucide-react'
import { createContext, useContext } from 'react'
import SeeMore from '../misc/see-more'

type StepperContextValue = {
	layout: 'horizontal' | 'vertical'
	useCompletedStepIcon?: boolean
	completedIcon?: ReactElement
}

const StepperContext = createContext<StepperContextValue>({
	layout: 'horizontal',
	useCompletedStepIcon: false,
})

const useStepperContext = () => useContext(StepperContext)

const stepperVariants = cva('flex', {
	variants: {
		layout: {
			horizontal: 'flex-row justify-between',
			vertical: 'flex-col gap-10',
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
		useCompletedStepIcon?: boolean
		completedIcon?: ReactElement
	}

const Stepper = forwardRef<HTMLOListElement, StepperProps>(
	(
		{
			children,
			className,
			layout = 'horizontal',
			useCompletedStepIcon,
			completedIcon,
			...rest
		}: Readonly<StepperProps>,
		ref
	) => {
		const childrenItems = Children.toArray(
			children
		) as ReactElement<StepProps>[]

		return (
			<StepperContext.Provider
				value={{ layout, useCompletedStepIcon, completedIcon }}>
				<ol
					ref={ref}
					className={cn(stepperVariants({ layout, className }))}
					{...rest}>
					{childrenItems.map((child, index) => {
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
		const { layout, useCompletedStepIcon, completedIcon } = useStepperContext()
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
				{indicator &&
					(completedStep ? (
						useCompletedStepIcon ? (
							<StepIndicator variant='completed'>
								{completedIcon ? completedIcon : <Check />}
							</StepIndicator>
						) : (
							cloneElement(indicator as ReactElement, {
								variant: 'completed',
							})
						)
					) : (
						cloneElement(indicator as ReactElement, {
							variant: activeStep ? 'active' : 'default',
						})
					))}

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

/*
	Si no existe indicator no debo mostrar nada
	Si existe indicator debo hacer lo siguiente:
	  1. Si esta completado debo preguntar si usa el icono de completado
	  	1.1 Si usa el icono de completado debo mostrar el icono de completado
		1.2 Si no usa el icono de completado debo mostrar el indicator con el variant completed
	  2. Si no esta completado debo mostrar el indicator con el variant active o default según sea el caso
 */

Step.displayName = 'Step'

const stepIndicatorVariants = cva(
	'flex size-10 items-center justify-center font-secondary text-base font-semibold',
	{
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
	}
)

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
				className={cn(stepIndicatorVariants({ shape, variant, className }))}
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
