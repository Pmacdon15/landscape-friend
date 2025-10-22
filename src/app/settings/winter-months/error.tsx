'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ContentContainer from '@/components/ui/containers/content-container'

export default function Page({
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
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
				variant={'outline'}
			>
				Try again
			</Button>
		</ContentContainer>
	)
}
