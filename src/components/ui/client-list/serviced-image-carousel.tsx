'use client'
import Image from 'next/image'
import { useMemo, useState } from 'react'
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
	base64Image: string
}

export default function ServicedImageCarousel({
	imageUrlList,
}: {
	imageUrlList: ServicedImage[]
}) {
	const [selectedDay, setSelectedDay] = useState<string>('')

	const groupedImages = useMemo(() => {
		const groups: Record<string, ServicedImage[]> = {}
		for (const image of imageUrlList) {
			const day = new Date(image.date).toDateString()
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
	}, [imageUrlList, selectedDay])

	const availableDays = Object.keys(groupedImages).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	)

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
							key={image.base64Image}
						>
							<Image
								alt={`Serviced Image: ${index}`}
								blurDataURL={'/placeholder.png'}
								height={500}
								placeholder="blur"
								src={image.base64Image}
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
