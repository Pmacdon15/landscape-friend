import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
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
import SheetLogoHeader from "../header/sheet-logo-header"

export function EditSettingSheet({ prompt, children }: { prompt: string, children: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Edit</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetLogoHeader />
                    <SheetTitle>Edit Setting</SheetTitle>
                    <SheetDescription>
                        {prompt}
                    </SheetDescription>
                </SheetHeader>
                <div className=" flex flex-col gap-2">
                    {children}
                    <SheetClose asChild>
                        <Button className="w-full">Close</Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}
