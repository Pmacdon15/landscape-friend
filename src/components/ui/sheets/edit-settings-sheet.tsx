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
	variant = 'button',
}: {
	title: string | React.ReactNode
	prompt: string
	children: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
	variant?: 'button' | 'link'
}) {
	// console.log(open)
	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetTrigger asChild>
				{variant === 'button' ? (
					<Button variant="outline">{title}</Button>
				) : (
					<button
						className="text-blue-500 underline hover:cursor-pointer"
						type="button"
					>
						{title}
					</button>
				)}
			</SheetTrigger>
			<SheetContent className="flex flex-col">
				<SheetHeader>
					<SheetLogoHeader />
					<SheetTitle>Update Form</SheetTitle>
					<SheetDescription>{prompt}</SheetDescription>
				</SheetHeader>
				<div className="flex-grow overflow-y-auto">{children}</div>
				<SheetClose asChild>
					<Button className="w-full">Close</Button>
				</SheetClose>
			</SheetContent>
		</Sheet>
	)
}
