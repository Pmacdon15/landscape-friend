import { Suspense } from 'react'
import {
	fetchCuttingClients,
	fetchSnowClearingClients,
} from '@/lib/dal/clients-dal'
import { parseClientListParams } from '@/lib/utils/params'
import ClientCards from './client-details/client-cards'

export default async function ClientListService({
	snow = false,
	isAdminPromise,
	props,
}: {
	snow?: boolean
	isAdminPromise: Promise<{ isAdmin: boolean }>
	props: PageProps<'/lists/cutting'> | PageProps<'/lists/clearing'>
}) {
	
	const parseClientListParamsPromise = props.searchParams.then(
		(searchParams) => parseClientListParams(searchParams),
	)

	const promiseToPass = snow
		? parseClientListParamsPromise.then((param) =>
				fetchSnowClearingClients(					
					param.searchTerm,
					param.serviceDate,
					param.searchTermIsServiced,
					param.searchTermAssignedTo,
				),
			)
		: parseClientListParamsPromise.then((param) =>
				fetchCuttingClients(					
					param.searchTerm,
					param.serviceDate,
					param.searchTermIsServiced,
					param.searchTermAssignedTo,
				),
			)

	return (
		<Suspense>
			<ClientCards
				clientsPromise={promiseToPass}
				isAdminPromise={isAdminPromise}
				parseClientListParamsPromise={parseClientListParamsPromise}
				snow={snow}
			/>
		</Suspense>
	)
}

// import { useState } from 'react'
// import page from '@/app/page'

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
