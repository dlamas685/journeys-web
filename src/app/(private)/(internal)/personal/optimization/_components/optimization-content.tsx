'use client'

import { Steps } from '../_enums'
import { useStepper } from '../_store/stepper.store'
import AdditionalOptimizationForm from './additional-optimization-form'
import AdvancedOptimizationForm from './advanced-optimization-form'
import BasicOptimizationForm from './basic-optimization-form'
import ResultsOptimizationForm from './results-optimization-form'

const OptimizationContent = () => {
	const currentStep = useStepper(state => state.currentStep)

	return (
		<section className='flex-grow'>
			{currentStep === Steps.BASIC && <BasicOptimizationForm />}
			{currentStep === Steps.ADVANCED && <AdvancedOptimizationForm />}
			{currentStep === Steps.ADDITIONAL && <AdditionalOptimizationForm />}
			{currentStep === Steps.RESULTS && <ResultsOptimizationForm />}
		</section>
	)
}

export default OptimizationContent
