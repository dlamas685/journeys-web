'use client'

import { useStepper } from '@/common/stores/stepper.store'
import { useEffect } from 'react'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'
import AdvancedOptimizationForm from './advanced-optimization-form'
import BasicOptimizationForm from './basic-optimization-form'
import ImportantInformation from './important-information'
import ResultsOptimizationForm from './results-optimization-form'

const OptimizationContent = () => {
	const currentStep = useStepper(state => state.currentStep)
	const results = useOptimization(state => state.results)

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
			{currentStep === Steps.BASIC && <BasicOptimizationForm />}
			{currentStep === Steps.ADVANCED && <AdvancedOptimizationForm />}
			{currentStep === Steps.RESULTS && <ResultsOptimizationForm />}
			{currentStep === -1 && <ImportantInformation />}
		</section>
	)
}

export default OptimizationContent
