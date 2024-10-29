import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayoutGrid, StretchHorizontal } from 'lucide-react'

const LayoutButtons = () => {
	return (
		<ToggleGroup type='single' size='sm' variant='outline'>
			<ToggleGroupItem value='bold' aria-label='Toggle bold'>
				<LayoutGrid className='size-4' />
			</ToggleGroupItem>
			<ToggleGroupItem value='italic' aria-label='Toggle italic'>
				<StretchHorizontal className='size-4' />
			</ToggleGroupItem>
		</ToggleGroup>
	)
}

export default LayoutButtons
