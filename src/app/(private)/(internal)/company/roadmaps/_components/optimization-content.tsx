'use client'

import { useStepper } from '@/common/stores/stepper.store'
import { useEffect } from 'react'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'
import FirstStageForm from './first-stage-form'
import ResultsForm from './results-form'
import SecondStageForm from './second-stage-form'
import ThirdStageForm from './third-stage-form'

const OptimizationContent = () => {
	const currentStep = useStepper(state => state.currentStep)

	useEffect(() => {
		useOptimization.persist.rehydrate()
		useStepper.persist.rehydrate()

		return () => {
			useOptimization.persist.clearStorage()
			useStepper.persist.clearStorage()
			useStepper.setState({ currentStep: 0, stepsCompleted: [] })
			useOptimization.setState({ presets: undefined, results: undefined })
		}
	}, [])

	return (
		<section className='flex-grow'>
			{currentStep === Steps.FIRST_STAGE && <FirstStageForm />}
			{currentStep === Steps.SECOND_STAGE && <SecondStageForm />}
			{currentStep === Steps.THIRD_STAGE && <ThirdStageForm />}
			{currentStep === Steps.RESULTS && <ResultsForm />}
		</section>
	)
}

export default OptimizationContent
