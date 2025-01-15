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
import { useStepper } from '../_store/stepper.store'

const OptimizationControls = () => {
	const currentStep = useStepper(state => state.currentStep)
	const handleReset = useStepper(state => state.handleReset)
	const handleBack = useStepper(state => state.handleBack)
	const isLoading = useLoading(state => state.loading)

	return (
		<section className='flex justify-end gap-3'>
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
