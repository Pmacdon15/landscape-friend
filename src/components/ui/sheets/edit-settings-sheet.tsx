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
						className="text-blue-500 hover:cursor-pointer underline"
						type="button"
					>
						{title}
					</button>
				)}
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
