interface EmailTemplateProps {
	name: string
	email: string
	message: string
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
	return (
		<div>
			<h1> {name} has sent a message!</h1>
			<p>
				{name}'s email is: {email}
			</p>
			<p>Their message to you is: {message}</p>
		</div>
	)
}
