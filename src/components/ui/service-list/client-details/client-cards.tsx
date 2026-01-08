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
	pagePromise,
}: {
	clientsPromise: Promise<ScheduledClient[] | { errorMessage: string }>
	parseClientListParamsPromise: Promise<ParsedClientListParams>
	snow: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	pagePromise: Promise<number>
}) {
	const clientSchedules = use(clientsPromise)
	const page = use(pagePromise)
	const parseClientListParams = use(parseClientListParamsPromise)
	const isAdmin = use(isAdminPromise ?? Promise.resolve({ isAdmin: false }))
	const { mutate } = useChangePriority()

	// console.log('clients:', clients)
	// State for managing client order
	// const [orderedClients, setOrderedClients] = useState<ClientResult[]>(
	// 	clients || [],
	// )

	//TODO: see about removing this state
	const [orderedClients, setOrderedClients] = useState<ScheduledClient[]>([])

	// Update ordered clients when clients data changes
	useEffect(() => {
		if (clientSchedules && Array.isArray(clientSchedules)) {
			setOrderedClients(clientSchedules)
		} else if (clientSchedules && 'errorMessage' in clientSchedules) {
			// Handle error case
			console.error(clientSchedules.errorMessage)
		}
	}, [clientSchedules])

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
					(item) => `${item.id}-${item.address}` === active.id,
				)
				const newIndex = items.findIndex(
					(item) => `${item.id}-${item.address}` === over.id,
				)

				const newOrder = arrayMove(items, oldIndex, newIndex)

				const draggedClient = items.find(
					(item) => `${item.id}-${item.address}` === active.id,
				)
				const targetClient = items.find(
					(item) => `${item.id}-${item.address}` === over.id,
				)

				if (!draggedClient || !targetClient) {
					console.error('Client not found')
					return newOrder
				}

				// Get the assignment of the dragged client
				const draggedAssignment = draggedClient.assignment_id
				// ? draggedClient.snow_assignments?.[0]
				// : draggedClient.grass_assignments?.[0]

				// Get the priority of the target client
				const targetAssignment = targetClient.priority
				// ? targetClient.snow_assignments?.[0]
				// : targetClient.grass_assignments?.[0]

				if (!draggedAssignment || !targetAssignment) {
					console.error('Client has no assignments')
					return newOrder
				}

				const assignmentId = draggedAssignment
				const newPriority = targetAssignment

				// Call the mutate function
				mutate({ assignmentId, priority: newPriority })

				console.log('Client order changed:', {
					clientId: active.id,
					oldPosition: oldIndex,
					newPosition: newIndex,
					newPriority,
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

	if ('errorMessage' in clientSchedules)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'Error Loading clients'} />
			</FormContainer>
		)

	if (clientSchedules.length < 1)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'No clients scheduled for today'} />{' '}
			</FormContainer>
		)

	const addresses = clientSchedules.map((c: ScheduledClient) => ({
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
						{orderedClients.map((client: ScheduledClient) => (
							<DraggableClientItem
								client={client}
								isAdmin={isAdmin?.isAdmin ?? false}
								key={`${client.id}-${client.address}`}
								page={page}
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
