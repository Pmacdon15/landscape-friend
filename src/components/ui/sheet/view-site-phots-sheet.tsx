import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../button"



export function ViewSitePhotoSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-blue-500 underline w-full ">View Site Service Photos</button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Site Serviced Photos</SheetTitle>
                    <SheetDescription>
                        View phots of the serviced sites.
                    </SheetDescription>
                </SheetHeader>
                {/* Images here */}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
