'use client'
import { useLoading } from '@/common/stores/loading.store'
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
import { useStepper } from '../_store/stepper.store'
import OptimizationPreview from './optimization-preview'

const OptimizationControls = () => {
	const currentStep = useStepper(state => state.currentStep)
	const presets = useOptimization(state => state.presets)
	const handleReset = useStepper(state => state.handleReset)
	const handleBack = useStepper(state => state.handleBack)
	const handleNext = useStepper(state => state.handleNext)
	const isLoading = useLoading(state => state.loading)

	return (
		<section className='flex justify-end gap-3'>
			{(currentStep === Steps.ADVANCED || currentStep === Steps.ADDITIONAL) && (
				<Button variant='link' type='button' onClick={handleNext}>
					Omitir
				</Button>
			)}
			{presets && (
				<OptimizationPreview
					presets={presets}
					label='Previsualizar'
					title='Criterios de optimización'
					description='En esta vista previa podrás ver los criterios de optimización que has seleccionado. Estos criterios son los que se utilizarán para optimizar tu viaje.'
				/>
			)}
			{currentStep === -1 && (
				<Button onClick={handleReset} variant='destructive' type='button'>
					<RotateCcw className='mr-1 size-5' />
					Reiniciar
				</Button>
			)}
			{currentStep > Steps.BASIC && (
				<Button variant='outline' onClick={handleBack} type='button'>
					<CircleChevronLeft className='mr-1 size-5' />
					Atrás
				</Button>
			)}
			{currentStep >= Steps.BASIC && currentStep < Steps.RESULTS && (
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
				<Button form={currentStep.toString()} type='submit'>
					{isLoading ? (
						<LoaderCircle className='mr-1 size-5 animate-spin' />
					) : (
						<SaveAll className='mr-1 size-5' />
					)}
					Finalizar
				</Button>
			)}
		</section>
	)
}

export default OptimizationControls
