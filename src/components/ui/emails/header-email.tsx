import { HeaderEmailProps } from '@/types/resend-types'
import {
	Body,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Text,
	Tailwind,
} from '@react-email/components'
import * as React from 'react'

export default function HeaderEmail({
	text,
	senderName,
	companyName,
	title,
}: HeaderEmailProps) {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Email from {companyName}</Preview>
				<Body className="bg-white text-black w-full m-0 p-0">
					{/* Image header */}
					<Img
						src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/Screenshot%20From%202025-08-10%2020-37-34.png"
						alt="Landscape Friend Logo"
						className="w-full h-auto"
					/>

					{/* Main content container */}
					<div className="max-w-xl mx-auto px-6 py-6">
						<Heading className="text-[#138b10] text-xl font-bold mb-4 ">
							{title}
						</Heading>

						<Text className="text-base leading-relaxed">
							{text}
						</Text>

						<Text className="text-sm mt-6 font-semibold">
							{senderName}
						</Text>
					</div>
				</Body>
			</Html>
		</Tailwind>
	)
}
