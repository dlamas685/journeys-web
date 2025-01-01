'use client'
import { Button } from '@/components/ui/button'
import {
	CircleChevronLeft,
	CircleChevronRight,
	RotateCcw,
	SaveAll,
} from 'lucide-react'
import { useStepper } from '../_store/stepper.store'

const OptimizationControls = () => {
	const currentStep = useStepper(state => state.currentStep)
	const setCurrentStep = useStepper(state => state.setCurrent)
	const setCompletedSteps = useStepper(state => state.setStepsCompleted)
	const completedSteps = useStepper(state => state.stepsCompleted)

	const handleNext = () => {
		setCurrentStep(currentStep + 1)
		setCompletedSteps([...completedSteps, currentStep])
	}

	const handleBack = () => {
		setCurrentStep(currentStep - 1)
		setCompletedSteps(completedSteps.filter(step => step !== currentStep - 1))
	}

	const handleFinish = () => {
		setCurrentStep(-1)
		setCompletedSteps([...completedSteps, currentStep])
	}

	const handleReset = () => {
		setCurrentStep(0)
		setCompletedSteps([])
	}

	return (
		<section className='flex justify-end gap-3'>
			{currentStep === -1 && (
				<Button onClick={handleReset} variant='destructive'>
					<RotateCcw className='mr-1 size-5' />
					Reiniciar
				</Button>
			)}
			{currentStep > 0 && (
				<Button variant='outline' onClick={handleBack}>
					<CircleChevronLeft className='mr-1 size-5' />
					Atrás
				</Button>
			)}
			{currentStep >= 0 && currentStep < 3 && (
				<Button onClick={handleNext}>
					<CircleChevronRight className='mr-1 size-5' />
					Siguiente
				</Button>
			)}
			{currentStep === 3 && (
				<Button onClick={handleFinish}>
					<SaveAll className='mr-1 size-5' />
					Finalizar
				</Button>
			)}
		</section>
	)
}

export default OptimizationControls
