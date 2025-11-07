'use client'
import { useState } from 'react'
import FormHeader from '../header/form-header'

export default function ScribeContainer({
	children,
	text,
}: {
	children: React.ReactNode
	text: string
}) {
	const [showDocs, setShowDocs] = useState(false)
	return (
		<div className="flex w-full max-w-full flex-col gap-4">
			<button
				className={'w-full'}
				onClick={() => setShowDocs(!showDocs)}
				type="button"
			>
				<FormHeader text={text}>
					{showDocs ? 'Click to Collapse ' : 'Click to Expand'}
				</FormHeader>
			</button>
			<div
				className={`transition-all duration-300 ${showDocs ? 'block opacity-100' : 'hidden opacity-0'}`}
			>
				{children}
			</div>
		</div>
	)
}
