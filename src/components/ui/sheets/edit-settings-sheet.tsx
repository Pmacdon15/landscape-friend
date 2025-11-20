import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import SheetLogoHeader from '../header/sheet-logo-header'

export function EditSettingSheet({
	title,
	prompt,
	children,
	open,
	onOpenChange,
}: {
	title: string | React.ReactNode
	prompt: string
	children: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}) {
	// console.log(open)
	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetTrigger asChild>
				<Button variant="outline">{title}</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetLogoHeader />
					<SheetTitle>Update Form</SheetTitle>
					<SheetDescription>{prompt}</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-2">
					{children}
					<SheetClose asChild>
						<Button className="w-full">Close</Button>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	)
}
