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
import { Steps } from '../_enums'

const OptimizationStepper = () => {
	const currentStep = useStepper(state => state.currentStep)
	const completedSteps = useStepper(state => state.stepsCompleted)
	const isDesktop = useMediaQuery('(min-width: 640px)')

	return (
		<Stepper layout={isDesktop ? 'vertical' : 'horizontal'}>
			<Step
				activeStep={currentStep === Steps.FIRST_STAGE}
				completedStep={completedSteps.includes(Steps.FIRST_STAGE)}>
				<StepIndicator className='text-lg'>1</StepIndicator>
				<StepLabel>Primera Etapa</StepLabel>
				<StepDescription className='hidden sm:block'>
					Proporcione la información inicial para el cálculo de rutas,
					incluyendo ubicaciones, horarios y consideraciones especiales para el
					tránsito. Esta información será utilizada para optimizar la hoja de
					rutas.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === Steps.SECOND_STAGE}
				completedStep={completedSteps.includes(Steps.SECOND_STAGE)}>
				<StepIndicator className='text-lg'>2</StepIndicator>
				<StepLabel>Segunda Etapa</StepLabel>
				<StepDescription className='hidden sm:block'>
					Configura los servicios a domicilio seleccionando actividades,
					estableciendo ubicaciones y especificando la duración. Asegúrate de
					proporcionar los detalles necesarios para cada servicio.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === Steps.RESULTS}
				completedStep={completedSteps.includes(Steps.RESULTS)}>
				<StepIndicator className='text-lg'>3</StepIndicator>
				<StepLabel>Resultados</StepLabel>
				<StepDescription className='hidden sm:block'>
					Visualiza los resultados de la optimización de acuerdo a los variables
					configuradas, incluyendo la hoja de rutas y los detalles de cada
					servicio a domicilio.
				</StepDescription>
			</Step>
		</Stepper>
	)
}

export default OptimizationStepper
