'use client'
import {
	Step,
	StepDescription,
	StepIndicator,
	StepLabel,
	Stepper,
} from '@/common/components/ui/menu/stepper'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { useStepper } from '@/common/stores/stepper.store'
import { ClipboardList, ReceiptText, Waypoints } from 'lucide-react'
import { Steps } from '../_enums'

const OptimizationStepper = () => {
	const currentStep = useStepper(state => state.currentStep)
	const completedSteps = useStepper(state => state.stepsCompleted)
	const isDesktop = useMediaQuery('(min-width: 640px)')

	return (
		<Stepper layout={isDesktop ? 'vertical' : 'horizontal'}>
			<Step
				activeStep={currentStep === Steps.BASIC}
				completedStep={completedSteps.includes(Steps.BASIC)}>
				<StepIndicator>
					<Waypoints />
				</StepIndicator>
				<StepLabel>Criterios Básicos</StepLabel>
				<StepDescription className='hidden sm:block'>
					En este paso, podrás definir los aspectos esenciales para planificar
					tu viaje de manera eficiente y personalizada. Aquí establecerás el
					punto de partida y el destino final, considerando factores clave que
					impactan tu experiencia en el camino.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === Steps.ADVANCED}
				completedStep={completedSteps.includes(Steps.ADVANCED)}>
				<StepIndicator>
					<ClipboardList />
				</StepIndicator>
				<StepLabel>Criterios Avanzados</StepLabel>
				<StepDescription className='hidden sm:block'>
					En este paso podrás personalizar aún más tu experiencia de viaje al
					incorporar detalles específicos y ajustes estratégicos
				</StepDescription>
			</Step>
			{/* <Step
				activeStep={currentStep === Steps.ADDITIONAL}
				completedStep={completedSteps.includes(Steps.ADDITIONAL)}>
				<StepIndicator>
					<Package />
				</StepIndicator>
				<StepLabel>Criterios Adicionales</StepLabel>
				<StepDescription className='hidden sm:block'>
					En este paso, podrás agregar una publicación para realizar entregas al
					finalizar tu viaje. Además, podrás optimizar la ruta para una mejor
					eficiencia e incorporando ganancias adicionales.
				</StepDescription>
			</Step> */}
			<Step
				activeStep={currentStep === Steps.RESULTS}
				completedStep={completedSteps.includes(Steps.RESULTS)}>
				<StepIndicator>
					<ReceiptText />
				</StepIndicator>
				<StepLabel>Resultados</StepLabel>
				<StepDescription className='hidden sm:block'>
					En este paso, podrás visualizar los resultados de tu planificación y
					ajustar los detalles necesarios para optimizar tu experiencia de
					viaje.
				</StepDescription>
			</Step>
		</Stepper>
	)
}

export default OptimizationStepper
