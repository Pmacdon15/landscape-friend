import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type z from 'zod'
import { changePriority } from '@/actions/assignment-action'
import { uploadDrawing, uploadImage } from '@/actions/blobs-action'
import {
	addClient,
	deleteClient,
	deleteSiteMap,
	updateClient,
	updateCuttingDay,
} from '@/actions/clients-action'
import { assignGrassCutting, markYardServiced } from '@/actions/cuts-action'

import {
	sendEmailWithTemplate,
	sendNewsLetter,
} from '@/actions/sendEmails-action'
import { assignSnowClearing } from '@/actions/snow-action'
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
} from '@/actions/stripe-action'
import type {
	schemaCreateQuote,
	schemaUpdateStatement,
} from '@/lib/zod/schemas'
import type { MarkQuoteProps } from '@/types/stripe-types'
import type { AddClientFormSchema } from '../zod/client-schemas'

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
			return result
		},
		onSuccess: () => {
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
		},
	})
}

export const useUpdateClient = (
	page: number,
	options?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	},
) => {
	return useMutation({
		mutationFn: async ({
			data,
			clientId,
		}: {
			data: z.infer<typeof AddClientFormSchema>
			clientId: number
		}) => {
			const result = await updateClient(data, clientId, page)
			if (result.errorMessage) {
				throw new Error(result.errorMessage)
			}
			return result
		},
		onSuccess: () => {
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
		},
	})
}

//MARK: Delete client
export const useDeleteClient = (
	page?: number,
	options?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	},
) => {
	return useMutation({
		mutationFn: (clientId: number) => {
			return deleteClient(clientId, page ?? 1)
		},
		onSuccess: () => {
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
		},
	})
}

//MARK:Upload Image for site map
export const useUploadImage = ({
	onSuccess,
	onError,
	page,
}: {
	onSuccess?: () => void
	onError?: (error: Error) => void
	page: number
}) => {
	return useMutation({
		mutationFn: ({
			addressId,
			formData,
		}: {
			addressId: number
			formData: FormData
		}) => {
			return uploadImage(addressId, formData, page)
		},
		onSuccess: () => {
			onSuccess?.()
			toast.success('Image uploaded successfully!', {
				duration: 1500,
			})
		},

		onError: (error) => {
			onError?.(error)
			console.error('Upload failed:', error)
			toast.error('Image upload failed!', { duration: 1500 })
		},
	})
}
//MARK:Delete site map

export const useDeleteSiteMap = (page: number) => {
	return useMutation({
		mutationFn: ({ siteMapId }: { siteMapId: number }) => {
			return deleteSiteMap(siteMapId, page)
		},
		onSuccess: () => {
			toast.success('Success deleting sitemap.')
		},
		onError: () => {
			toast.error('Error deleting sitemap.')
		},
	})
}
//MARK:Upload drawing site map
export const useUploadDrawing = (page: number) => {
	return useMutation({
		mutationFn: ({
			file,
			addressId,
		}: {
			file: Blob
			addressId: number
		}) => {
			return uploadDrawing(file, addressId, page)
		},
		onSuccess: () => {
			// onSuccess?.();
		},
		onError: () => {
			// onError?.();
		},
	})
}

//MARK:Update cutting day
export const useUpdateCuttingDay = (page?: number) => {
	return useMutation({
		mutationFn: ({
			addressId,
			cuttingWeek,
			cuttingDay,
		}: {
			addressId: number
			cuttingWeek: number
			cuttingDay: string
		}) => {
			return updateCuttingDay(
				addressId,
				cuttingWeek,
				cuttingDay,
				page ?? 1,
			)
		},
		onSuccess: () => {
			toast.success('Success updating cutting day.')
		},
		onError: (error) => {
			toast.error('Error updating cutting day.')
			console.error('Mutation error:', error)
		},
	})
}

//MARK: Assign snow clearing
export const useAssignSnowClearing = (page?: number) => {
	return useMutation({
		mutationFn: ({
			assignedTo,
			addressId,
		}: {
			assignedTo: string
			addressId: number
		}) => {
			return assignSnowClearing(assignedTo, addressId, page ?? 1)
		},
		onSuccess: () => {
			toast.success('Success changing snow assignment.')
		},
		onError: () => {
			toast.error('Error changing snow assignment.')
		},
	})
}

//MARK: Assign grass cutting
export const useAssignGrassCutting = (page?: number) => {
	return useMutation({
		mutationFn: ({
			assignedTo,
			addressId,
		}: {
			assignedTo: string
			addressId: number
		}) => {
			return assignGrassCutting(assignedTo, addressId, page ?? 1)
		},
		onSuccess: () => {
			toast.success('Success changing grass assignment.')
		},
		onError: () => {
			toast.error('Error changing grass assignment.')
		},
	})
}
//MARK:Mark yard serviced
export const useMarkYardServiced = (options?: {
	onSuccess?: () => void
	onError?: (error: Error) => void
}) => {
	return useMutation({
		mutationFn: async ({
			addressId,
			date,
			snow = false,
			images,
		}: {
			addressId: number
			date: Date
			snow?: boolean
			images: File[]
		}) => {
			const result = await markYardServiced(addressId, date, snow, images)
			if (result?.errorMessage) {
				throw new Error(result.errorMessage)
			}
			return result // Return the result to indicate success
		},
		onSuccess: () => {
			options?.onSuccess?.()
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			options?.onError?.(error)
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
		mutationFn: async ({
			quoteData,
			clientId,
		}: {
			quoteData: z.infer<typeof schemaCreateQuote>
			clientId: number
		}) => {
			const result = await createStripeQuote(quoteData, clientId)
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
export const useCreateStripeSubscriptionQuote = () => {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const result = await createSubscriptionQuoteAction(formData)
			if (!result.success) {
				throw new Error('Failed to create Stripe subscription')
			}
			return result
		},
		onSuccess: () => {},
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
			toast.success('Success updating stripe API key.')
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			toast.error('Error  updating stripe API key.')
		},
		y,
	})
}

//MARK: Resend invoice
export const useResendInvoice = () => {
	return useMutation({
		mutationFn: async (invoiceId: string) => {
			return resendInvoice(invoiceId)
		},
		onSuccess: () => {},
	})
}

//MARK:Mark invoice paid
export const useMarkInvoicePaid = () => {
	return useMutation({
		mutationFn: async (invoiceId: string) => {
			return markInvoicePaid(invoiceId)
		},
		onSuccess: () => {
			toast.success('Success marking invoice paid.')
		},
		onError: () => {
			toast.error('Error marking invoice paid.')
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
			toast.success('Success marking invoice void.')
		},
		onError: () => {
			toast.error('Error marking invoice void.')
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
			toast.success('Success updating quote')
		},
		onError: () => {
			toast.error('Error updating quote.')
		},
	})
}

//MARK: Cancel subscription
export const useCancelSubscription = () => {
	return useMutation({
		mutationFn: (subscriptionId: string) =>
			cancelSubscription(subscriptionId),
		onSuccess: () => {
			toast.success('Success canceling subscription')
		},
		onError: () => {
			toast.error('Error canceling subscription')
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
		onSuccess: () => {},
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	})
}
