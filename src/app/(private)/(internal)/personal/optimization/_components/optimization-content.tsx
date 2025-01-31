'use client'

import { useStepper } from '@/common/stores/stepper.store'
import { Steps } from '../_enums'
import AdvancedOptimizationForm from './advanced-optimization-form'
import BasicOptimizationForm from './basic-optimization-form'
import ResultsOptimizationForm from './results-optimization-form'

const OptimizationContent = () => {
	const currentStep = useStepper(state => state.currentStep)

	return (
		<section className='flex-grow'>
			{currentStep === Steps.BASIC && <BasicOptimizationForm />}
			{currentStep === Steps.ADVANCED && <AdvancedOptimizationForm />}
			{currentStep === Steps.RESULTS && <ResultsOptimizationForm />}
		</section>
	)
}

export default OptimizationContent
