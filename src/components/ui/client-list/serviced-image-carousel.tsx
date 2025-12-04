'use client'
import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '../carousel'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

interface ServicedImage {
	date: Date
	imageurl: string
}

export default function ServicedImageCarousel({
	imageUrlList,
}: {
	imageUrlList: ServicedImage[]
}) {
	const [selectedDay, setSelectedDay] = useState<string>('')
	const [clientTimeZone, setClientTimeZone] = useState<string>('')

	useEffect(() => {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
		setClientTimeZone(tz)
	}, [])

	const groupedImages = useMemo(() => {
		if (!clientTimeZone) return {}
		const groups: Record<string, ServicedImage[]> = {}
		for (const image of imageUrlList) {
			const centralTimeDate = new Date(image.date)
			const clientTimeDate = new Date(centralTimeDate.toLocaleString('en-US', { timeZone: clientTimeZone }))
			const day = clientTimeDate.toDateString()
			if (!groups[day]) {
				groups[day] = []
			}
			groups[day].push(image)
		}
		// Set the initial selected day to the most recent one
		if (Object.keys(groups).length > 0) {
			const mostRecentDay = Object.keys(groups).sort(
				(a, b) => new Date(b).getTime() - new Date(a).getTime(),
			)[0]
			if (!selectedDay) {
				setSelectedDay(mostRecentDay)
			}
		}
		return groups
	}, [imageUrlList, selectedDay, clientTimeZone])

	const availableDays = Object.keys(groupedImages).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	)

	if (!clientTimeZone) return <div>Loading...</div>

	return (
		<div className="p-8">
			{availableDays.length > 1 && (
				<div className="mb-4">
					<label
						className="mb-2 block font-medium text-gray-700 text-sm"
						htmlFor="day-selector"
					>
						Select a day
					</label>
					<Select onValueChange={setSelectedDay} value={selectedDay}>
						<SelectTrigger>
							<SelectValue placeholder="Select a day" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{availableDays.map((day) => (
									<SelectItem key={day} value={day}>
										{day}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			)}
			<Carousel>
				<CarouselContent>
					{(groupedImages[selectedDay] || []).map((image, index) => (
						<CarouselItem
							className={'basis-[85%]'}
							key={image.imageurl}
						>
							<Image
								alt={`Serviced Image: ${index}`}
								height={500}
								src={image.imageurl}
								width={500}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	)
}