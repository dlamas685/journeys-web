'use client'

import { useStepper } from '@/common/stores/stepper.store'
import { Steps } from '../_enums'
import FirstStageForm from './first-stage-form'
import ResultsForm from './results-form'
import SecondStageForm from './second-stage-form'

const OptimizationContent = () => {
	const currentStep = useStepper(state => state.currentStep)

	return (
		<section className='flex-grow'>
			{currentStep === Steps.FIRST_STAGE && <FirstStageForm />}
			{currentStep === Steps.SECOND_STAGE && <SecondStageForm />}
			{currentStep === Steps.RESULTS && <ResultsForm />}
		</section>
	)
}

export default OptimizationContent
