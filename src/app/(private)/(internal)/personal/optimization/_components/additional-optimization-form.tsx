'use client'

import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Steps } from '../_enums'
import { useOptimization } from '../_store/optimization.store'

const AdditionalOptimizationForm = () => {
	const form = useForm<any>({})

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const handleNext = useStepper(state => state.handleNext)

	const handleSubmit = async ({}: any) => {
		handleNext()
	}

	return (
		<Form {...form}>
			<form
				id={Steps.ADDITIONAL.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-2 gap-3'>
				<h2>Criterios Adicionales</h2>
			</form>
		</Form>
	)
}

export default AdditionalOptimizationForm
