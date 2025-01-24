import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Steps } from '../_enums'

const ResultsForm = () => {
	const form = useForm<any>({})

	const handleSubmit = (values: any) => {}

	return (
		<Form {...form}>
			<form
				id={Steps.RESULTS.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Resultados
				</h2>
			</form>
		</Form>
	)
}

export default ResultsForm
