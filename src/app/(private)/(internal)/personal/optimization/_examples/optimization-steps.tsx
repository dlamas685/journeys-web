'use client'
import { Button } from '@/components/ui/button'
import {
	Step,
	StepDescription,
	StepLabel,
	Stepper,
} from '@/components/ui/steps'
import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible'
import { useState } from 'react'

const OptimizationSteps = () => {
	const steps = [
		{
			label: 'Criterios Básicos',
			description: `En esta sección, podrás definir los aspectos esenciales para planificar tu viaje de manera eficiente y personalizada. Aquí establecerás el punto de partida y el destino final, considerando factores clave que impactan tu experiencia en el camino.`,
		},
		{
			label: 'Criterios Avanzados',
			description:
				'En esta sección podrás personalizar aún más tu experiencia de viaje al incorporar detalles específicos y ajustes estratégicos',
		},
		{
			label: 'Criterios Adicionales',
			description: `En esta sección, podrás agregar funcionalidades avanzadas que enriquecen tu experiencia de viaje y te permiten aprovechar al máximo cada trayecto.`,
		},

		{
			label: 'Resultados',
			description: `En esta sección, podrás visualizar los resultados de tu planificación y ajustar los detalles necesarios para optimizar tu experiencia de viaje.`,
		},
	]

	const [activeStep, setActiveStep] = useState(0)

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1)
	}

	const handleReset = () => {
		setActiveStep(0)
	}
	return (
		<div>
			<Stepper
				current={activeStep}
				direction='vertical'
				gap
				activeStep={activeStep}>
				{steps.map((step, index) => (
					<Step key={step.label} className='min-h-[50px]'>
						<StepLabel className='text-base font-semibold'>
							{step.label}
						</StepLabel>
						<Collapsible open={activeStep === index}>
							<CollapsibleContent className='CollapsibleContent'>
								<StepDescription className='max-w-[300px]'>
									<div className='text-sm'>{step.description}</div>
									<div className='mb-2'>
										<div className='mb-4 mt-2 space-x-3'>
											{index === steps.length - 1 ? (
												<Button size='sm' color='success' onClick={handleNext}>
													Finalizar
												</Button>
											) : (
												<Button size='sm' color='info' onClick={handleNext}>
													Continuar
												</Button>
											)}

											<Button
												size='sm'
												variant='outline'
												color='warning'
												disabled={index === 0}
												onClick={handleBack}>
												Atrás
											</Button>
										</div>
									</div>
								</StepDescription>
							</CollapsibleContent>
						</Collapsible>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<div>
					<div className='mb-3 font-semibold'>
						All steps completed - youre finished
					</div>
					<Button color='destructive' size='sm' onClick={handleReset}>
						Reset
					</Button>
				</div>
			)}
		</div>
	)
}

export default OptimizationSteps
