import React from 'react'

interface InputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
	name: string
	type: string
	placeholder?: string
	required?: boolean
	className?: string
	step?: number
	defaultValue?: string | number
	error?: string
}

export const InputField = React.forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputFieldProps
>(
	(
		{
			name,
			type,
			placeholder,
			required = false,
			className = '',
			step,
			defaultValue,
			error,
			...rest
		},
		ref,
	) => {
		if (type === 'textarea') {
			return (
				<div className="flex w-full flex-col">
					<textarea
						className={`sm h-46 rounded border bg-white p-1 md:h-36 ${className} ${error ? 'border-red-500' : ''}`}
						defaultValue={defaultValue as string}
						id={name}
						name={name}
						placeholder={placeholder}
						ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
						required={required}
						{...rest}
					/>
					{error && (
						<p className="mt-1 text-red-500 text-xs">{error}</p>
					)}
				</div>
			)
		}

		return (
			<div className="flex w-full flex-col">
				<input
					className={`sm rounded border bg-white p-1 ${className} ${error ? 'border-red-500' : ''}`}
					defaultValue={defaultValue}
					id={name}
					name={name}
					placeholder={placeholder}
					ref={ref as React.ForwardedRef<HTMLInputElement>}
					required={required}
					step={step || 1}
					type={type}
					{...rest}
				/>
				{error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
			</div>
		)
	},
)

InputField.displayName = 'InputField'
