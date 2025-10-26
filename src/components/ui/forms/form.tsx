import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
	Controller,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'
import { Calendar } from '@/components/ui/calendar'
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

type FormControlProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = {
	name: TName
	label: ReactNode
	description?: ReactNode
	control: ControllerProps<TFieldValues, TName, TTransformedValues>['control']
}

type FormBaseProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
	horizontal?: boolean
	controlFirst?: boolean
	children: (
		field: Parameters<
			ControllerProps<TFieldValues, TName, TTransformedValues>['render']
		>[0]['field'] & {
			'aria-invalid': boolean
			id: string
		},
	) => ReactNode
}

type FormControlFunc<
	ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>(
	props: FormControlProps<TFieldValues, TName, TTransformedValues> &
		ExtraProps,
) => ReactNode

function FormBase<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>({
	children,
	control,
	label,
	name,
	description,
	controlFirst,
	horizontal,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const labelElement = (
					<>
						<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
						{description && (
							<FieldDescription>{description}</FieldDescription>
						)}
					</>
				)
				const control = children({
					...field,
					id: field.name,
					'aria-invalid': fieldState.invalid,
				})
				const errorElem = fieldState.invalid && (
					<FieldError errors={[fieldState.error]} />
				)

				return (
					<Field
						data-invalid={fieldState.invalid}
						orientation={horizontal ? 'horizontal' : undefined}
					>
						{controlFirst ? (
							<>
								{control}
								<FieldContent>
									{labelElement}
									{errorElem}
								</FieldContent>
							</>
						) : (
							<>
								<FieldContent>{labelElement}</FieldContent>
								{control}
								{errorElem}
							</>
						)}
					</Field>
				)
			}}
		/>
	)
}
export const FormInput: FormControlFunc<{
	type?: 'text' | 'number'
	hidden?: boolean
	disabled?: boolean
	list?: string
	min?: string | number
	step?: string | number
}> = ({ type, hidden, disabled, list, min, step, ...props }) => {
	if (hidden) {
		// If hidden, we don't need the label, description, etc. from FormBase.
		return (
			<Controller
				control={props.control}
				name={props.name}
				render={({ field }) => (
					<Input {...field} type="hidden" value={field.value ?? ''} />
				)}
			/>
		)
	}

	return (
		<FormBase {...props}>
			{(field) => (
				<Input
					{...field}
					disabled={disabled}
					list={list}
					min={min}
					onChange={(e) =>
						field.onChange(
							type === 'number'
								? e.target.valueAsNumber
								: e.target.value,
						)
					}
					step={step}
					type={type}
					value={field.value ?? ''}
				/>
			)}
		</FormBase>
	)
}

export const FormTextarea: FormControlFunc = (props) => {
	return <FormBase {...props}>{(field) => <Textarea {...field} />}</FormBase>
}

export const FormSelect: FormControlFunc<{
	children?: ReactNode
	options?: { value: string; label: string }[]
}> = ({ children, options, ...props }) => {
	if (options) {
		children = options.map((option) => (
			<SelectItem key={option.value} value={option.value}>
				{option.label}
			</SelectItem>
		))
	}

	return (
		<FormBase {...props}>
			{({ onChange, onBlur, ...field }) => (
				<Select {...field} onValueChange={onChange}>
					<SelectTrigger
						aria-invalid={field['aria-invalid']}
						id={field.id}
						onBlur={onBlur}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>{children}</SelectContent>
				</Select>
			)}
		</FormBase>
	)
}

export const FormDatePicker: FormControlFunc = (props) => {
	return (
		<FormBase {...props}>
			{(field) => (
				<div className="w-32">
					<Popover>
						<PopoverTrigger>
							<div className='flex gap-4 border rounded-sm p-1 px-4'>
								{/* <Button
								className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
								data-empty={!field.value}
								variant="outline"
							> */}
								<CalendarIcon />
								{field.value ? (
									format(field.value, 'PPP')
								) : (
									<span>Pick a date</span>
								)}
							</div>
							{/* </Button> */}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								onSelect={field.onChange}
								selected={field.value}
							/>
						</PopoverContent>
					</Popover>
				</div>
			)}
		</FormBase>
	)
}

// export const FormCheckbox: FormControlFunc = props => {
//   return (
//     <FormBase {...props} horizontal controlFirst>
//       {({ onChange, value, ...field }) => (
//         <Checkbox {...field} checked={value} onCheckedChange={onChange} />
//       )}
//     </FormBase>
//   )
// }
