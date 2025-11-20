'use client'
import { use } from 'react'
import type { Client, ClientsReturn } from '@/types/clients-types'
import type { ParsedClientListParams } from '@/types/params-types'
import MarkYardServiced from '../../buttons/mark-yard-serviced'
import FormContainer from '../../containers/form-container'
import FormHeader from '../../header/form-header'
import ManyPointsMap from '../../map-component/many-points-map'
import ClientDetailsCard from './ClientDetailsCard'

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
			<ul className="flex w-full flex-col items-center gap-2 rounded-sm md:gap-4">
				{clients?.clients.map((client: Client) => (
					<FormContainer key={client.id}>
						<li className="w-full rounded-sm border bg-white/50 p-4">
							<ClientDetailsCard
								client={client}
								isAdmin={isAdmin?.isAdmin}
								searchTermIsServiced={
									parseClientListParams.searchTermIsServiced
								}
								serviceDate={parseClientListParams.serviceDate}
								snow={snow}
							/>
						</li>
						
						{parseClientListParams.serviceDate && (
							<MarkYardServiced
								clientId={client.id}
								serviceDate={parseClientListParams.serviceDate}
								snow={snow}
							/>
						)}
						
					</FormContainer>
				))}
			</ul>
		</>
	)
}

// interface DraggableItemProps {
// 	id: string
// 	content: string
// 	onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void
// 	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
// 	onDrop: (e: React.DragEvent<HTMLDivElement>) => void
// }

// function DraggableItem({
// 	id,
// 	content,
// 	onDragStart,
// 	onDragOver,
// 	onDrop,
// }: DraggableItemProps) {
// 	return (
// 		<div
// 			draggable={true}
// 			onDragOver={onDragOver}
// 			onDragStart={(e) => onDragStart(e, id)}
// 			onDrop={onDrop}
// 			style={{
// 				border: '1px solid black',
// 				padding: '10px',
// 				margin: '5px',
// 			}}
// 		>
// 			{content}
// 		</div>
// 	)
// }

// interface Item {
// 	id: string
// 	content: string
// }

// function DraggableList() {
// 	const [items, setItems] = useState<Item[]>([
// 		{ id: 'item1', content: 'Item 1' },
// 		{ id: 'item2', content: 'Item 2' },
// 		{ id: 'item3', content: 'Item 3' },
// 	])

// 	const handleDragStart = (
// 		e: React.DragEvent<HTMLDivElement>,
// 		id: string,
// 	) => {
// 		e.dataTransfer.setData('text/plain', id)
// 	}

// 	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
// 		e.preventDefault()
// 	}

// 	const handleDrop = (
// 		e: React.DragEvent<HTMLDivElement>,
// 		targetId: string,
// 	) => {
// 		const draggedId = e.dataTransfer.getData('text/plain')
// 		const draggedIndex = items.findIndex((item) => item.id === draggedId)
// 		const targetIndex = items.findIndex((item) => item.id === targetId)

// 		if (draggedIndex !== targetIndex) {
// 			const newItems = [...items]
// 			const [draggedItem] = newItems.splice(draggedIndex, 1)
// 			newItems.splice(targetIndex, 0, draggedItem)
// 			setItems(newItems)
// 		}
// 	}

// 	return (
// 		<div>
// 			{items.map((item) => (
// 				<DraggableItem
// 					content={item.content}
// 					id={item.id}
// 					key={item.id}
// 					onDragOver={handleDragOver}
// 					onDragStart={handleDragStart}
// 					onDrop={(e) => handleDrop(e, item.id)}
// 				/>
// 			))}
// 		</div>
// 	)
// }
