import { X } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function Alert({
	text,
	functionAction,
	variant = 'default',
	isPending,
}: {
	text?: string
	functionAction: () => void
	variant?: 'default' | 'remove-sitemap' | 'remove-client'
	isPending?: boolean
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<div>
					{variant === 'default' && (
						<Button variant="outline">{text}</Button>
					)}
					{variant === 'remove-sitemap' && (
						<button
							className={`rounded-sm border p-1 ${isPending ? 'bg-gray/40' : 'bg-white/40'} `}
							disabled={isPending}
							type="button"
						>
							{text}
						</button>
					)}
					{variant === 'remove-client' && (
						<button
							className="rounded-sm border bg-white/70"
							disabled={isPending}
							type="button"
						>
							<X size={18} />
						</button>
					)}
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your data and remove it from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => functionAction()}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
