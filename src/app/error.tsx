'use client'

import { Button } from '@/components/ui/button'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<FormContainer>
			<FormHeader text={'Landscape Friend'} />
			<div className="flex flex-col items-center justify-center gap-4 p-4 bg-white/70 shadow-lg rounded-sm">
				<h2 className="text-lg font-semibold text-red-500">
					Something went wrong!
				</h2>
				<p className="text-sm text-gray-600">{error.message}</p>
				<Button
					className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-background/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
					onClick={() => reset()}
					variant="outline"
				>
					Try again
				</Button>
			</div>
		</FormContainer>
	)
}
