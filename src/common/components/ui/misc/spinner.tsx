'use client'
import { useLoading } from '@/common/stores/loading.store'
import { useEffect } from 'react'
import RiseLoader from 'react-spinners/RiseLoader'

const Spinner = () => {
	const isLoading = useLoading(store => store.loading)

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
				<div className='absolute left-0 top-0 min-h-screen w-full bg-black opacity-25' />
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
