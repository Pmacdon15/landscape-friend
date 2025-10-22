'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import ContentContainer from '@/components/ui/containers/content-container'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<ContentContainer>
			<h2>Something went wrong!</h2>
			<Button
				variant={'outline'}
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
		</ContentContainer>
	)
}
