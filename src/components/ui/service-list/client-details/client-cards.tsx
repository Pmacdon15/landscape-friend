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
import type { ClientResult } from '@/types/clients-types'
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
	clientsPromise: Promise<ClientResult[] | null>
	parseClientListParamsPromise: Promise<ParsedClientListParams>
	snow: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
}) {
	const clients = use(clientsPromise)
	const parseClientListParams = use(parseClientListParamsPromise)
	const isAdmin = use(isAdminPromise ?? Promise.resolve({ isAdmin: false }))
	const { mutate } = useChangePriority()

	console.log('clients:', clients)
	// State for managing client order
	const [orderedClients, setOrderedClients] = useState<ClientResult[]>(
		clients || [],
	)

	// Update ordered clients when clients data changes
	useEffect(() => {
		if (clients) {
			setOrderedClients(clients)
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

				const client = items.find((item) => item.id === active.id)

				if (!client) {
					console.error('Client not found')
					return newOrder
				}

				// Get the assignment
				const assignment =
					client.snow_assignments?.[0] ||
					client.grass_assignments?.[0]

				if (!assignment) {
					console.error('Client has no assignments')
					return newOrder
				}

				// Get the assignment ID and new priority
				const assignmentId = assignment.id
				const newPriority = newIndex + 1 // assuming priorities start from 1

				// Call the mutate function
				mutate({ assignmentId, priority: newPriority })

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

	if (clients.length < 1)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'No clients scheduled for today'} />{' '}
			</FormContainer>
		)

	const addresses = clients.map((c: ClientResult) => ({
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
						{orderedClients.map((client: ClientResult) => (
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
