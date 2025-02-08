import HTMLRenderer from '@/common/components/ui/misc/html-renderer'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { MANEUVER_ICONS } from '../_constants/maneuver.constant'
import { RouteModel } from '../_models'

type Props = {
	route: RouteModel
}

const Indications = ({ route }: Readonly<Props>) => {
	return (
		<Accordion type='single' collapsible>
			{route.legs.map((leg, index) => (
				<AccordionItem key={index} value={index.toString()}>
					<AccordionTrigger className='font-normal text-muted-foreground hover:no-underline'>
						<span>
							<span className='font-medium'>Tramo #{index + 1}</span>
							{leg.steps[0].navigationInstruction.instructions && (
								<HTMLRenderer
									html={leg.steps[0].navigationInstruction.instructions}
								/>
							)}
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<ul role='list' className='flex flex-col gap-2'>
							{leg.steps.map(
								(step, index) =>
									index !== 0 && (
										<li
											role='listitem'
											key={index}
											className='flex gap-1 text-muted-foreground'>
											{step.navigationInstruction.maneuver && (
												<span className='material-symbols-outlined'>
													{MANEUVER_ICONS[step.navigationInstruction.maneuver]}
												</span>
											)}
											{step.navigationInstruction.instructions && (
												<HTMLRenderer
													html={step.navigationInstruction.instructions}
												/>
											)}
										</li>
									)
							)}
						</ul>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

export default Indications
