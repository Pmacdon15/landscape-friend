import { InputFieldProps } from "@/types/types";


export function InputField({ id, name, type, placeholder, required = false, className = '', step, defaultValue }: InputFieldProps) {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            className={`border rounded sm p-1 bg-white ${className}`}
            step={step || 1}
            defaultValue={defaultValue}
        />
    );
}