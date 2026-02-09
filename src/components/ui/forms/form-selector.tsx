'use client'
import type React from 'react'
import { Suspense, useState } from 'react'
import FormHeader from '@/components/ui/header/form-header' // Import FormHeader
import { CreateQuoteForm } from '@/components/ui/stripe-forms/stripe-quote-form/create-quote-form'
import { CreateSubscriptionForm } from '@/components/ui/stripe-forms/stripe-subscription-form/create-subscription-form'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import { CreateQuoteFormFallback } from '../fallbacks/quotes/create-quote-form-fallback'
import CreateSubscriptionFormFallback from '../fallbacks/quotes/create-subscription-form-fallback'
import BackToLink from '../links/back-to-link'

export const FormSelector: React.FC<CreateSubscriptionFormProps> = ({
	organizationIdPromise,
	clientsPromise,
	productsPromise,
}) => {
	const [formType, setFormType] = useState<'quote' | 'subscription'>('quote')

	return (
		<>
			<FormHeader
				text={
					formType === 'quote'
						? 'Create Stripe Quote'
						: 'Create Stripe Subscription'
				}
			/>
			<div className="mb-4 flex justify-center space-x-4">
				<button
					className={`rounded-md px-4 py-2 ${formType === 'quote' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
					onClick={() => setFormType('quote')}
					type="button"
				>
					Create Quote
				</button>
				<button
					className={`rounded-md px-4 py-2 ${formType === 'subscription' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
					onClick={() => setFormType('subscription')}
					type="button"
				>
					Create Subscription
				</button>
			</div>
			<div className="rounded-md border p-4 shadow-sm">
				{formType === 'quote' ? (
					<Suspense fallback={<CreateQuoteFormFallback />}>
						<CreateQuoteForm
							clientsPromise={clientsPromise}
							organizationIdPromise={organizationIdPromise}
							productsPromise={productsPromise}
						/>
					</Suspense>
				) : (
					<Suspense fallback={<CreateSubscriptionFormFallback />}>
						<CreateSubscriptionForm
							clientsPromise={clientsPromise}
							organizationIdPromise={organizationIdPromise}
						/>
					</Suspense>
				)}
			</div>
			<BackToLink path={'/billing/manage/quotes'} place={'Quotes'} />
		</>
	)
}
