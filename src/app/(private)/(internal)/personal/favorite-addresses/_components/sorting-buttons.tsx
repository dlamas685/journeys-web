import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'

const SortingButtons = () => {
	return (
		<ToggleGroup type='single' size='sm' variant='outline' defaultValue='asc'>
			<ToggleGroupItem value='asc' aria-label='Toggle bold'>
				<ArrowUpAZ className='size-4' />
			</ToggleGroupItem>
			<ToggleGroupItem value='desc' aria-label='Toggle italic'>
				<ArrowDownAZ className='size-4' />
			</ToggleGroupItem>
		</ToggleGroup>
	)
}

export default SortingButtons
