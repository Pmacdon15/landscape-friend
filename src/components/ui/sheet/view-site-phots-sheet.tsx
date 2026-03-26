'use client'

import { useQuery } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import { fetchServicedImagesUrlsAction } from '@/actions/clients-action'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../button'
import ServicedImageCarousel from '../client-list/serviced-image-carousel'
import FormHeader from '../header/form-header'
import SheetLogoHeader from '../header/sheet-logo-header'

function SitePhotosContent({ addressId }: { addressId: number }) {
	const { data: imagesUrlsObjects = [], isLoading } = useQuery({
		queryKey: ['serviced-images', addressId],
		queryFn: () => fetchServicedImagesUrlsAction(addressId),
	})

	if (isLoading) {
		return <p className="m-4 text-center">Loading images...</p>
	}

	return (
		<>
			{imagesUrlsObjects.length > 0 ? (
				<ServicedImageCarousel imageUrlList={imagesUrlsObjects} />
			) : (
				<div className="m-2">
					<FormHeader>Add Images by marking yard serviced</FormHeader>
				</div>
			)}
		</>
	)
}

export function ViewSitePhotoSheet({ addressId }: { addressId: number }) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					className="mx-auto flex gap-2 text-blue-500 underline hover:cursor-pointer"
					type="button"
				>
					<Camera />
					View Site Service Photos
				</button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll">
				<SheetLogoHeader />
				<SheetHeader>
					<SheetTitle>Site Serviced Photos</SheetTitle>
					<SheetDescription>
						View photos of the serviced sites.
					</SheetDescription>
				</SheetHeader>

				<SitePhotosContent addressId={addressId} />

				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
