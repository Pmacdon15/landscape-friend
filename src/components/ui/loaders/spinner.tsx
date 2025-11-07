const Spinner = ({
	variant = 'default',
}: {
	variant?: 'default' | 'notification-menu'
}) => {
	if (variant === 'default') {
		return (
			<div className="flex items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-white border-b-2"></div>
			</div>
		)
	} else {
		return (
			<div className="flex items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
			</div>
		)
	}
}

export default Spinner
