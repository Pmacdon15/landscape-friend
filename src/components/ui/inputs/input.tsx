interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
    className?: string;
}

export function InputField({ id, name, type, placeholder, required = false, className = '' }: InputFieldProps) {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            className={`border rounded sm p-2 bg-white ${className}`}
        />
    );
}