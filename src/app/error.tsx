'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div>
			<h1>Something wrong!</h1>
			<button onClick={() => reset()}>Try again</button>
		</div>
	)
}
