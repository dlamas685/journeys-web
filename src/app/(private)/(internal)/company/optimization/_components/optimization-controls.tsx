'use client'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { Button } from '@/components/ui/button'
import {
	CircleChevronLeft,
	CircleChevronRight,
	LoaderCircle,
	RotateCcw,
	SaveAll,
} from 'lucide-react'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'

const OptimizationControls = () => {
	const currentStep = useStepper(state => state.currentStep)
	const handleReset = useStepper(state => state.handleReset)
	const handleBack = useStepper(state => state.handleBack)
	const handleNext = useStepper(state => state.handleNext)
	const isLoading = useLoading(state => state.loading)
	const presets = useOptimization(state => state.presets)
	const setPresets = useOptimization(state => state.setPresets)
	const setResults = useOptimization(state => state.setResults)
	const results = useOptimization(state => state.results)

	const handleOmit = () => {
		if (presets) {
			if (currentStep === Steps.THIRD_STAGE) {
				setPresets({
					...presets,
					thirdStage: undefined,
				})
				handleNext()
			}
		}
	}

	const handleBackResults = () => {
		if (results) {
			if (currentStep === Steps.RESULTS) {
				setResults({
					...results,
					response: undefined,
				})

				handleBack()
			}
		}
	}

	const handleResetAll = () => {
		useOptimization.persist.clearStorage()
		useStepper.persist.clearStorage()
		useStepper.setState({ currentStep: 0, stepsCompleted: [] })
		useOptimization.setState({ presets: undefined, results: undefined })
	}

	return (
		<section className='flex justify-end gap-3 sm:px-2'>
			{currentStep === Steps.THIRD_STAGE && (
				<Button variant='link' type='button' onClick={handleOmit}>
					Omitir
				</Button>
			)}

			{currentStep === -1 && (
				<Button onClick={handleResetAll} variant='destructive' type='button'>
					<RotateCcw className='mr-1 size-5' />
					Reiniciar
				</Button>
			)}
			{currentStep > Steps.FIRST_STAGE && currentStep < Steps.RESULTS && (
				<Button variant='outline' type='button' onClick={handleBack}>
					<CircleChevronLeft className='mr-1 size-5' />
					Atrás
				</Button>
			)}

			{currentStep >= Steps.FIRST_STAGE && currentStep < Steps.RESULTS && (
				<Button form={currentStep.toString()} type='submit'>
					{isLoading ? (
						<LoaderCircle className='mr-1 size-5 animate-spin' />
					) : (
						<CircleChevronRight className='mr-1 size-5' />
					)}
					Siguiente
				</Button>
			)}

			{currentStep === Steps.RESULTS && (
				<>
					<Button variant='outline' type='button' onClick={handleBackResults}>
						<CircleChevronLeft className='mr-1 size-5' />
						Atrás
					</Button>
					<Button form={currentStep.toString()} type='submit'>
						{isLoading ? (
							<LoaderCircle className='mr-1 size-5 animate-spin' />
						) : (
							<SaveAll className='mr-1 size-5' />
						)}
						Finalizar
					</Button>
				</>
			)}
		</section>
	)
}

export default OptimizationControls
