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
				activeStep={currentStep === Steps.THIRD_STAGE}
				completedStep={completedSteps.includes(Steps.THIRD_STAGE)}>
				<StepIndicator className='text-lg'>3</StepIndicator>
				<StepLabel>Tercera Etapa</StepLabel>
				<StepDescription className='hidden sm:block'>
					Selecciona un perfil de costos para optimizar según tus necesidades.
					Si lo deseas, también puedes establecer límites en la duración total,
					el tiempo en tránsito y la distancia recorrida.
				</StepDescription>
			</Step>
			<Step
				activeStep={currentStep === Steps.RESULTS}
				completedStep={completedSteps.includes(Steps.RESULTS)}>
				<StepIndicator className='text-lg'>4</StepIndicator>
				<StepLabel>Resultados</StepLabel>
				<StepDescription className='hidden sm:block'>
					Visualiza los resultados de la optimización de acuerdo a las variables
					configuradas, incluyendo la hoja de rutas y los detalles de cada
					servicio a domicilio.
				</StepDescription>
			</Step>
		</Stepper>
	)
}

export default OptimizationStepper
