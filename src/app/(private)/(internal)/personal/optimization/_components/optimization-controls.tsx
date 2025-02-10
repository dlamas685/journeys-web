'use client'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	CircleCheck,
	CircleChevronLeft,
	CircleChevronRight,
	CircleX,
	LoaderCircle,
	RotateCcw,
	SaveAll,
} from 'lucide-react'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'

const OptimizationControls = () => {
	const currentStep = useStepper(state => state.currentStep)
	const presets = useOptimization(state => state.presets)
	const setPresets = useOptimization(state => state.setPresets)
	const handleBack = useStepper(state => state.handleBack)
	const handleNext = useStepper(state => state.handleNext)
	const isLoading = useLoading(state => state.loading)

	const handleOmit = () => {
		if (presets) {
			if (currentStep === Steps.ADVANCED) {
				setPresets({
					...presets,
					advanced: undefined,
				})
				handleNext()
			}
		}
	}

	return (
		<section className='flex justify-end gap-3'>
			{currentStep === Steps.ADVANCED && (
				<Button variant='link' type='button' onClick={handleOmit}>
					Omitir
				</Button>
			)}

			{currentStep === -1 && (
				<Button
					onClick={() => {
						useOptimization.persist.clearStorage()
						useStepper.persist.clearStorage()
						useStepper.setState({ currentStep: 0, stepsCompleted: [] })
						useOptimization.setState({ presets: undefined, results: undefined })
					}}
					variant='destructive'
					type='button'>
					<RotateCcw className='mr-1 size-5' />
					Reiniciar
				</Button>
			)}
			{currentStep > Steps.BASIC && currentStep < Steps.RESULTS && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='outline' type='button'>
							<CircleChevronLeft className='mr-1 size-5' />
							Atrás
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								¿Está seguro de que desea regresar al paso anterior?
							</AlertDialogTitle>
							<AlertDialogDescription>
								Tenga en cuenta que esta acción eliminará todo lo que ha
								realizado en el paso actual.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								<CircleX className='mr-1 size-4' />
								Cancelar
							</AlertDialogCancel>
							<AlertDialogAction onClick={handleBack}>
								<CircleCheck className='mr-1 size-4' />
								Continuar
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
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
				<>
					<Button variant='outline' type='button' onClick={handleBack}>
						<CircleChevronLeft className='mr-1 size-5' />
						Atrás
					</Button>
					<Button form={currentStep.toString()} type='submit'>
						{isLoading ? (
							<LoaderCircle className='mr-1 size-5 animate-spin' />
						) : (
							<SaveAll className='mr-1 size-5' />
						)}
						Guardar
					</Button>
				</>
			)}
		</section>
	)
}

export default OptimizationControls
