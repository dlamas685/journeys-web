'use client'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true)
			} else {
				setIsVisible(false)
			}
		}

		window.addEventListener('scroll', toggleVisibility)

		return () => {
			window.removeEventListener('scroll', toggleVisibility)
		}
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<div className='fixed bottom-6 right-6'>
			{isVisible && (
				<Button onClick={scrollToTop} variant='secondary' size='icon'>
					<ChevronUp className='size-5' />
				</Button>
			)}
		</div>
	)
}

export default ScrollToTopButton
