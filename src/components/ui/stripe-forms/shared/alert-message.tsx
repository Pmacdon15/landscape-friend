'use client'
import Link from 'next/link'
import type React from 'react'
import { cn } from '@/lib/utils/utils'

interface AlertMessageProps {
	type: 'success' | 'error' | 'info'
	message: string | React.ReactNode
	pathname?: string
	id?: string
	path?: string
}

export function AlertMessage({
	type,
	message,
	pathname,
	id,
	path,
}: AlertMessageProps) {
	const baseClasses = 'mt-4 p-3 rounded-md text-sm font-medium'
	const styles = {
		success: 'bg-green-100 text-green-800 border border-green-300',
		error: 'bg-red-100 text-red-800 border border-red-300',
		info: 'bg-blue-100 text-blue-800 border border-blue-300',
	}

	// Parse pathname to separate path and query string
	const parsePathname = (path?: string) => {
		if (!path) return { pathname: '', query: {} }

		const [basePath, queryString] = path.split('?')
		const query: Record<string, string> = {}

		if (queryString) {
			const params = new URLSearchParams(queryString)
			params.forEach((value, key) => {
				query[key] = value
			})
		}

		return { pathname: basePath, query }
	}

	const { pathname: basePath, query: parsedQuery } = parsePathname(pathname)
	const hrefQuery = id ? { search: id } : parsedQuery

	return (
		<div className={cn(baseClasses, styles[type])}>
			{message}
			{pathname && ' View '}
			{pathname && (
				<Link
					className="text-blue-600"
					href={{ pathname: basePath, query: hrefQuery }}
				>
					{path}
				</Link>
			)}
		</div>
	)
}
