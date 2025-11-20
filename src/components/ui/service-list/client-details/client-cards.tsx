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
import type { Client, ClientsReturn } from '@/types/clients-types'
import type { ParsedClientListParams } from '@/types/params-types'
import FormContainer from '../../containers/form-container'
import FormHeader from '../../header/form-header'
import ManyPointsMap from '../../map-component/many-points-map'
import DraggableClientItem from './draggable-client-item'

export default function ClientCards({
	clientsPromise,
	parseClientListParamsPromise,
	snow,
	isAdminPromise,
}: {
	clientsPromise: Promise<ClientsReturn | null>
	parseClientListParamsPromise: Promise<ParsedClientListParams>
	snow: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
}) {
	const clients = use(clientsPromise)
	const parseClientListParams = use(parseClientListParamsPromise)
	const isAdmin = use(isAdminPromise ?? Promise.resolve({ isAdmin: false }))

	// State for managing client order
	const [orderedClients, setOrderedClients] = useState<Client[]>(
		clients?.clients ?? [],
	)

	// Update ordered clients when clients data changes
	useEffect(() => {
		if (clients?.clients) {
			setOrderedClients(clients.clients)
		}
	}, [clients])

	// Configure drag sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	// Handle drag end event
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			setOrderedClients((items) => {
				const oldIndex = items.findIndex(
					(item) => item.id === active.id,
				)
				const newIndex = items.findIndex((item) => item.id === over.id)

				const newOrder = arrayMove(items, oldIndex, newIndex)

				// TODO: Call mutation here to update priority in the database
				// Example:
				// updateClientPriority({
				//   clientId: active.id as string,
				//   newPriority: newIndex,
				//   serviceDate: parseClientListParams.serviceDate,
				//   snow: snow
				// })

				console.log('Client order changed:', {
					clientId: active.id,
					oldPosition: oldIndex,
					newPosition: newIndex,
					message:
						'Add your mutation call here to persist the new order',
				})

				return newOrder
			})
		}
	}

	if (!parseClientListParams.serviceDate)
		return (
			<FormContainer>
				{' '}
				<FormHeader
					text={'Please select a date to see the client list'}
				/>{' '}
			</FormContainer>
		)
	if (!clients)
		return (
			<FormContainer>
				{' '}
				<p className="text-red-500">Error Loading clients</p>{' '}
			</FormContainer>
		)

	if (clients.clients.length < 1)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'No clients scheduled for today'} />{' '}
			</FormContainer>
		)

	const addresses = clients.clients.map((c: Client) => ({
		id: c.id,
		address: c.address,
	}))
	const flattenedAddresses =
		addresses?.map((address: { address: string }) => address.address) ?? []

	return (
		<>
			{addresses && addresses?.length > 0 && (
				<FormContainer>
					<div className="flex w-full flex-col items-center justify-center gap-4 p-2 align-middle md:flex-row">
						<FormHeader
							text={`Clients Left to Service Today: ${flattenedAddresses.length - 1}`}
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
					items={orderedClients.map((c) => c.id)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="flex w-full flex-col items-center gap-2 rounded-sm md:gap-4">
						{orderedClients.map((client: Client) => (
							<DraggableClientItem
								client={client}
								isAdmin={isAdmin?.isAdmin ?? false}
								key={client.id}
								searchTermIsServiced={
									parseClientListParams.searchTermIsServiced
								}
								serviceDate={parseClientListParams.serviceDate}
								snow={snow}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</>
	)
}
