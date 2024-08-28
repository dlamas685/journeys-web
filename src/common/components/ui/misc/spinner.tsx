'use client'
import { useLoading } from '@/common/stores/loading.store'
import { useEffect } from 'react'
import RiseLoader from 'react-spinners/RiseLoader'

const Spinner = () => {
	const isLoading = useLoading(store => store.isLoading)

	useEffect(() => {
		const body = document.body

		if (isLoading) {
			body.style.overflow = 'hidden'
		} else {
			body.style.overflow = 'auto'
		}
		return () => {
			body.style.overflow = 'auto'
		}
	}, [isLoading])

	return (
		<>
			{isLoading && (
				<div className='w-full min-h-screen absolute top-0 left-0 bg-black opacity-25' />
			)}
			<RiseLoader
				loading={isLoading}
				cssOverride={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
				aria-label='Loading Spinner'
				data-testid='loader'
			/>
		</>
	)
}

export default Spinner
