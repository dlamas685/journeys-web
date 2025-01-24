'use client'

import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'

const ResultsOptimizationForm = () => {
	const form = useForm<any>({})

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const handleFinish = useStepper(state => state.handleFinish)

	const handleSubmit = async ({}: any) => {
		handleFinish()
	}

	return (
		<Form {...form}>
			<form
				id={Steps.RESULTS.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-2 gap-3'>
				<h2>Resultados</h2>
			</form>
		</Form>
	)
}

export default ResultsOptimizationForm
