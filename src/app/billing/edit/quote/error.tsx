'use client'

import { Button } from '@/components/ui/button'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'

export default function Page({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<FormContainer>
			<FormHeader text={'Edit Quotes'} />
			<div className="flex flex-col items-center justify-center gap-4 rounded-sm bg-white/70 p-4 shadow-lg">
				<h2 className="font-semibold text-lg text-red-500">
					Something went wrong!
				</h2>
				<p className="text-gray-600 text-sm">{error.message}</p>
				<Button
					className="rounded-md px-4 py-2 font-medium text-sm text-white hover:bg-background/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					onClick={() => reset()}
					variant="outline"
				>
					Try again
				</Button>
			</div>
		</FormContainer>
	)
}
