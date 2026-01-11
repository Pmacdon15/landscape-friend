'use client'

interface DateDisplayProps {
	timestamp: number | string
}

export function DateDisplay({ timestamp }: DateDisplayProps) {
	if (!timestamp || timestamp === 0 || timestamp === '0') return <>N/A</>
	const date =
		typeof timestamp === 'number'
			? new Date(timestamp * 1000)
			: new Date(timestamp)
	return <>{date.toLocaleDateString()}</>
}
