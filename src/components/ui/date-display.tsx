'use client'

import React from 'react'

interface DateDisplayProps {
	timestamp: number | string
}

export function DateDisplay({ timestamp }: DateDisplayProps) {
	const date =
		typeof timestamp === 'number'
			? new Date(timestamp * 1000)
			: new Date(timestamp)
	return <>{date.toLocaleDateString()}</>
}
