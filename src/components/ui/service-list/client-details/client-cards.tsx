'use client'

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { use, useEffect, useState } from 'react'
import { useChangePriority } from '@/lib/mutations/mutations'
import type { ScheduledClient } from '@/types/assignment-types'
import type { ParsedClientListParams } from '@/types/params-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import FormContainer from '../../containers/form-container'
import FormHeader from '../../header/form-header'
import ManyPointsMap from '../../map-component/many-points-map'
import DraggableClientItem from './draggable-client-item'

export default function ClientCards({
	clientsPromise,
	parseClientListParamsPromise,
	snow,
	isAdminPromise,
	pagePromise,
}: {
	clientsPromise: Promise<
		| {
				clientsSchedules: ScheduledClient[]
				siteMaps: ClientSiteMapImages[]
		  }
		| {
				errorMessage: string
		  }
	>
	parseClientListParamsPromise: Promise<ParsedClientListParams>
	snow: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	pagePromise: Promise<number>
}) {
	const clientSchedules = use(clientsPromise)

	const parseClientListParams = use(parseClientListParamsPromise)

	const { mutate } = useChangePriority()

	// State for managing client order
	const [orderedClients, setOrderedClients] = useState<ScheduledClient[]>([])

	// Update ordered clients when clientSchedules changes
	useEffect(() => {
		if (!clientSchedules) return

		if ('errorMessage' in clientSchedules) {
			console.error(clientSchedules.errorMessage)
			setOrderedClients([])
		} else {
			setOrderedClients(clientSchedules.clientsSchedules)
		}
	}, [clientSchedules])

	// Configure drag sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	// Handle drag end
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		setOrderedClients((items) => {
			const oldIndex = items.findIndex(
				(item) => `${item.id}-${item.address}` === active.id,
			)
			const newIndex = items.findIndex(
				(item) => `${item.id}-${item.address}` === over.id,
			)

			const newOrder = arrayMove(items, oldIndex, newIndex)

			const draggedClient = items[oldIndex]
			const targetClient = items[newIndex]

			if (!draggedClient || !targetClient) return newOrder

			const draggedAssignment = draggedClient.assignment_id
			const targetAssignment = targetClient.priority

			if (!draggedAssignment || !targetAssignment) return newOrder

			mutate({
				assignmentId: draggedAssignment,
				priority: targetAssignment,
			})

			return newOrder
		})
	}

	//TODO Break these down in to components
	// Early returns for errors / no data
	if (!parseClientListParams.serviceDate)
		return (
			<FormContainer>
				<FormHeader text="Please select a date to see the client list" />
			</FormContainer>
		)

	if ('errorMessage' in clientSchedules)
		return (
			<FormContainer>
				<FormHeader text="Error Loading clients" />
			</FormContainer>
		)

	if (clientSchedules.clientsSchedules.length < 1)
		return (
			<FormContainer>
				<FormHeader text="No clients scheduled for today" />
			</FormContainer>
		)

	// Flatten addresses for map
	const flattenedAddresses = clientSchedules.siteMaps.map((m) => m.address)

	return (
		<>
			{flattenedAddresses.length > 0 && (
				<FormContainer>
					<div className="flex w-full flex-col items-center justify-center gap-4 p-2 align-middle md:flex-row">
						<FormHeader
							text={`Clients Left to Service Today: ${flattenedAddresses.length}`}
						/>
						<ManyPointsMap addresses={flattenedAddresses} />
					</div>
				</FormContainer>
			)}

			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<SortableContext
					items={orderedClients.map((c) => `${c.id}-${c.address}`)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="flex w-full flex-col items-center gap-2 rounded-sm md:gap-4">
						{orderedClients.map((client) => {
							const siteMapsForAddress =
								clientSchedules.siteMaps.filter(
									(map) =>
										map.address_id === client.address_id,
								)

							return (
								<DraggableClientItem
									addressId={client.address_id}
									client={client}
									isAdminPromise={
										isAdminPromise ||
										Promise.resolve({ isAdmin: false })
									}
									key={`${client.id}-${client.address}`}
									pagePromise={pagePromise}
									serviceDate={
										parseClientListParams.serviceDate
									}
									siteMaps={siteMapsForAddress}
									snow={snow}
								/>
							)
						})}
					</ul>
				</SortableContext>
			</DndContext>
		</>
	)
}
