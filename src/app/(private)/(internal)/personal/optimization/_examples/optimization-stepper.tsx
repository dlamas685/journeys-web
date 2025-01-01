'use client'
import {
	Step,
	StepDescription,
	StepIndicator,
	StepLabel,
	Stepper,
} from '@/common/components/ui/menu/stepper'
import { ClipboardList, Package, ReceiptText, Waypoints } from 'lucide-react'
import { useStepper } from '../_store/stepper.store'

const OptimizationStepper = () => {
	const currentStep = useStepper(state => state.currentStep)
	const completedSteps = useStepper(state => state.stepsCompleted)

	return (
		<Stepper layout='vertical'>
			<Step
				activeStep={currentStep === 0}
				completedStep={completedSteps.includes(0)}>
				<StepIndicator>
					<Waypoints />
				</StepIndicator>
				<StepLabel>Criterios Básicos</StepLabel>
				<StepDescription>
					En esta sección, podrás definir los aspectos esenciales para
					planificar tu viaje de manera eficiente y personalizada. Aquí
					establecerás el punto de partida y el destino final, considerando
					factores clave que impactan tu experiencia en el camino.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === 1}
				completedStep={completedSteps.includes(1)}>
				<StepIndicator>
					<ClipboardList />
				</StepIndicator>
				<StepLabel>Criterios Avanzados</StepLabel>
				<StepDescription>
					En esta sección podrás personalizar aún más tu experiencia de viaje al
					incorporar detalles específicos y ajustes estratégicos
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === 2}
				completedStep={completedSteps.includes(2)}>
				<StepIndicator>
					<Package />
				</StepIndicator>
				<StepLabel>Criterios Adicionales</StepLabel>
				<StepDescription>
					En esta sección, podrás agregar funcionalidades avanzadas que
					enriquecen tu experiencia de viaje y te permiten aprovechar al máximo
					cada trayecto.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === 3}
				completedStep={completedSteps.includes(3)}>
				<StepIndicator>
					<ReceiptText />
				</StepIndicator>
				<StepLabel>Resultados</StepLabel>
				<StepDescription>
					En esta sección, podrás visualizar los resultados de tu planificación
					y ajustar los detalles necesarios para optimizar tu experiencia de
					viaje.
				</StepDescription>
			</Step>
		</Stepper>
	)
}

export default OptimizationStepper
