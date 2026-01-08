'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Grip } from 'lucide-react'
import type { ScheduledClient } from '@/types/assignment-types'
import MarkYardServiced from '../../buttons/mark-yard-serviced'
import FormContainer from '../../containers/form-container'
import ClientDetailsCard from './ClientDetailsCard'

interface DraggableClientItemProps {
	client: ScheduledClient
	isAdmin: boolean
	addressId:number
	searchTermIsServiced: boolean
	serviceDate?: Date
	snow: boolean
	page: number
}

export default function DraggableClientItem({
	client,
	isAdmin,
	addressId,
	searchTermIsServiced,
	serviceDate,
	snow,
	page,
}: DraggableClientItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: `${client.id}-${client.address}` })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<FormContainer key={`${client.id} + ${client.address}`}>
			<li
				className="flex w-full flex-col gap-4 rounded-sm border bg-white/50 p-4"
				ref={setNodeRef}
				style={style}
			>
				<div className="flex items-start gap-2">
					{/* Drag handle */}
					<button
						type="button"
						{...attributes}
						{...listeners}
						aria-label="Drag to reorder"
						className="cursor-grab touch-none rounded p-2 hover:bg-gray-200 active:cursor-grabbing"
					>
						<Grip />
					</button>

					<div className="flex-1">
						<ClientDetailsCard
							client={client}
							isAdmin={isAdmin}
							page={page}
							searchTermIsServiced={searchTermIsServiced}
							serviceDate={serviceDate}
							snow={snow}
						/>
					</div>
				</div>

				{serviceDate && (
					<MarkYardServiced
						addressId={addressId}
						serviceDate={serviceDate}
						snow={snow}
					/>
				)}
			</li>
		</FormContainer>
	)
}
