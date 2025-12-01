import { useMutation } from '@tanstack/react-query'
import type { z } from 'zod'
import { changePriority } from '@/lib/actions/assignment-action'
import { uploadDrawing, uploadImage } from '@/lib/actions/blobs-action'
import {
	addClient,
	deleteClient,
	deleteSiteMap,
	updateClient,
	updateClientPricePerMonth,
	updateCuttingDay,
} from '@/lib/actions/clients-action'
import { assignGrassCutting, markYardServiced } from '@/lib/actions/cuts-action'

import {
	sendEmailWithTemplate,
	sendNewsLetter,
} from '@/lib/actions/sendEmails-action'
import { assignSnowClearing } from '@/lib/actions/snow-action'
import {
	cancelSubscription,
	createStripeQuote,
	createSubscriptionQuoteAction,
	markInvoicePaid,
	markInvoiceVoid,
	markQuote,
	resendInvoice,
	updateStripeAPIKey,
	updateStripeDocument,
} from '@/lib/actions/stripe-action'
import type {
	schemaCreateQuote,
	schemaUpdateStatement,
} from '@/lib/zod/schemas'
import type { MarkQuoteProps } from '@/types/stripe-types'
import {
	revalidatePathAction,
	updateTagAction,
} from '../actions/revalidatePath-action'
import type { AddClientFormSchema } from '../zod/client-schemas'
//TODO: Use update tag instead of revalidate
//MARK: Add client
export const useAddClient = (options?: {
	onSuccess?: () => void
	onError?: (error: Error) => void
}) => {
	return useMutation({
		mutationFn: async (data: z.infer<typeof AddClientFormSchema>) => {
			const result = await addClient(data)
			if (result.errorMessage) {
				throw new Error(result.errorMessage)
			}
			return result // return the result instead of calling addClient again
		},
		onSuccess: () => {
			revalidatePathAction('/lists/client')
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
		},
	})
}
//TODO: USE UPDATE TAG
export const useUpdateClient = (options?: {
	onSuccess?: () => void
	onError?: (error: Error) => void
}) => {
	return useMutation({
		mutationFn: ({
			data,
			clientId,
		}: {
			data: z.infer<typeof AddClientFormSchema>
			clientId: number
		}) => {
			return updateClient(data, clientId)
		},
		onSuccess: () => {
			revalidatePathAction('/lists/client')
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
		},
	})
}

//MARK: Delete client
export const useDeleteClient = () => {
	return useMutation({
		mutationFn: (clientId: number) => {
			return deleteClient(clientId)
		},
		onSuccess: () => {
			revalidatePathAction('/lists/client')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK:Upload Image for site map
export const useUploadImage = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void
	onError?: (error: Error) => void
}) => {
	return useMutation({
		mutationFn: ({
			clientId,
			formData,
		}: {
			clientId: number
			formData: FormData
		}) => {
			return uploadImage(clientId, formData)
		},
		onSuccess: () => {
			// revalidatePathAction("/lists/client");
			onSuccess?.()
		},
		onError: (error) => {
			onError?.(error)
		},
	})
}
//MARK:Delete site map

export const useDeleteSiteMap = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			siteMapId,
		}: {
			clientId: number
			siteMapId: number
		}) => {
			return deleteSiteMap(clientId, siteMapId)
		},
		onSuccess: () => {
			revalidatePathAction('/lists/client')
			revalidatePathAction('/lists/clearing')
			revalidatePathAction('/lists/cutting')
		},
		onError: () => {},
	})
}
//MARK:Upload drawing site map
// export const useUploadDrawing = ({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: Error) => void }) => {
export const useUploadDrawing = () => {
	return useMutation({
		mutationFn: ({ file, clientId }: { file: Blob; clientId: number }) => {
			return uploadDrawing(file, clientId)
		},
		onSuccess: () => {
			// revalidatePathAction("/lists/client");
			// onSuccess?.();
		},
		onError: () => {
			// onError?.();
		},
	})
}

//MARK:Update client price per cut
export const useUpdateClientPricePer = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			pricePerMonthGrass,
			snow = false,
		}: {
			clientId: number
			pricePerMonthGrass: number
			snow: boolean
		}) => {
			return updateClientPricePerMonth(clientId, pricePerMonthGrass, snow)
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK:Update cutting day
export const useUpdateCuttingDay = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			cuttingWeek,
			cuttingDay,
		}: {
			clientId: number
			cuttingWeek: number
			cuttingDay: string
		}) => {
			return updateCuttingDay(clientId, cuttingWeek, cuttingDay)
		},
		onSuccess: () => {
			revalidatePathAction('/lists/client')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK: Assign snow clearing
export const useAssignSnowClearing = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			assignedTo,
		}: {
			clientId: number
			assignedTo: string
		}) => {
			return assignSnowClearing(clientId, assignedTo)
		},
	})
}

//MARK: Assign grass cutting
export const useAssignGrassCutting = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			assignedTo,
		}: {
			clientId: number
			assignedTo: string
		}) => {
			return assignGrassCutting(clientId, assignedTo)
		},
	})
}
//MARK:Mark yard serviced
export const useMarkYardServiced = () => {
	return useMutation({
		mutationFn: ({
			clientId,
			date,
			snow = false,
			images,
		}: {
			clientId: number
			date: Date
			snow?: boolean
			images: File[]
		}) => {
			return markYardServiced(clientId, date, snow, images)
		},
		onSuccess: () => {
			revalidatePathAction('/lists/clearing')
			revalidatePathAction('/lists/cutting')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK: Send email with template
export const useSendEmailWithTemplate = ({
	clientEmail,
	onSuccess,
}: {
	clientEmail: string
	onSuccess?: () => void
}) => {
	return useMutation({
		mutationFn: (formData: FormData) => {
			return sendEmailWithTemplate(formData, clientEmail)
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
		onSuccess: () => {
			onSuccess?.()
		},
	})
}

//MARK:Send news letter
export const useSendNewsLetter = () => {
	return useMutation({
		mutationFn: (formData: FormData) => {
			return sendNewsLetter(formData)
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK:Create stripe quote
export const useCreateStripeQuote = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void
	onError?: () => void
} = {}) => {
	return useMutation({
		mutationFn: async (quoteData: z.infer<typeof schemaCreateQuote>) => {
			const result = await createStripeQuote(quoteData)
			if (!result.success) {
				throw new Error('Failed to create Stripe quote')
			}
			return result
		},
		onSuccess: () => {
			onSuccess?.()
		},
		onError: () => {
			onError?.()
		},
	})
}

//MARK:Create stripe subscription
export const useCreateStripeSubscriptionQuote = (snow: boolean) => {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const result = await createSubscriptionQuoteAction(formData, snow)
			if (!result.success) {
				throw new Error('Failed to create Stripe subscription')
			}
			return result
		},
		onSuccess: () => {
			revalidatePathAction('/billing/manage/subscriptions') // Assuming a subscriptions management page
		},
	})
}

//MARK:Update stripe document
export const useUpdateStripeDocument = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void
	onError?: () => void
} = {}) => {
	return useMutation({
		mutationFn: async (
			documentData: z.infer<typeof schemaUpdateStatement>,
		) => {
			const result = await updateStripeDocument(documentData)
			if (!result.success) {
				throw new Error('Failed to update Stripe document')
			}
			return result
		},
		onSuccess: () => onSuccess?.(),
		onError: () => onError?.(),
	})
}
//MARK:Update stripe api key
export const useUpdateStripeAPIKey = () => {
	return useMutation({
		mutationFn: (formData: FormData) => {
			return updateStripeAPIKey({ formData })
		},
		onSuccess: () => {
			revalidatePathAction('/settings/stripe-api-key')
			// revalidateTagAction('api-key')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}

//MARK: Resend invoice
export const useResendInvoice = () => {
	return useMutation({
		mutationFn: async (invoiceId: string) => {
			return resendInvoice(invoiceId)
		},
		onSuccess: () => {
			revalidatePathAction('/billing/manage/invoices')
		},
	})
}

//MARK:Mark invoice paid
export const useMarkInvoicePaid = () => {
	return useMutation({
		mutationFn: async (invoiceId: string) => {
			return markInvoicePaid(invoiceId)
		},
		onSuccess: () => {
			revalidatePathAction('/billing/manage/invoices')
		},
	})
}
//MARK: Mark invoice void
export const useMarkInvoiceVoid = () => {
	return useMutation({
		mutationFn: async (invoiceId: string) => {
			return markInvoiceVoid(invoiceId)
		},
		onSuccess: () => {
			revalidatePathAction('/billing/manage/invoices')
		},
	})
}

//MARK: Accept quote
export const useMarkQuote = () => {
	return useMutation({
		mutationFn: async ({ action, quoteId }: MarkQuoteProps) => {
			return markQuote({ action, quoteId })
		},
		onSuccess: () => {
			revalidatePathAction('/billing/manage/invoices')
		},
	})
}

//MARK: Cancel subscription
export const useCancelSubscription = () => {
	return useMutation({
		mutationFn: (subscriptionId: string) =>
			cancelSubscription(subscriptionId),
		onSuccess: () => {
			revalidatePathAction('/billing/manage/subscriptions')
		},
	})
}

//MARK: Change Priority
export const useChangePriority = () => {
	return useMutation({
		mutationFn: ({
			assignmentId,
			priority,
		}: {
			assignmentId: number
			priority: number
		}) => {
			return changePriority(assignmentId, priority)
		},
		onSuccess: () => {
			updateTagAction('snow-clients')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}
