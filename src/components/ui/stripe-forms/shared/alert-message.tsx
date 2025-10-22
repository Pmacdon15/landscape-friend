'use client'
import Link from 'next/link'
import type React from 'react'
import { cn } from '@/lib/utils/utils'

interface AlertMessageProps {
	type: 'success' | 'error' | 'info'
	message: string | React.ReactNode
	pathname?: string
	id?: string
}

export function AlertMessage({
	type,
	message,
	pathname,
	id,
}: AlertMessageProps) {
	const baseClasses = 'mt-4 p-3 rounded-md text-sm font-medium'
	const styles = {
		success: 'bg-green-100 text-green-800 border border-green-300',
		error: 'bg-red-100 text-red-800 border border-red-300',
		info: 'bg-blue-100 text-blue-800 border border-blue-300',
	}

	return (
		<div className={cn(baseClasses, styles[type])}>
			{message} View{' '}
			{pathname && id && (
				<Link
					className="text-blue-600"
					href={{ pathname, query: { search: id } }}
				>
					Quote
				</Link>
			)}
		</div>
	)
}
