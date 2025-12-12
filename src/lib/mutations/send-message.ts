'use client'
import { useMutation } from '@tanstack/react-query'
import type z from 'zod'
import { sendEmail } from '@/lib/actions/resend'
import type { formSchema } from '../zod/schemas'

export const useSendMessage = (options?: {
	onSuccess?: () => void
	onError?: (error: unknown) => void
}) => {
	return useMutation({
		mutationFn: (values: z.infer<typeof formSchema>) => {
			return sendEmail(values)
		},
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	})
}
