

export function InputField({ name, type, placeholder, required = false, className = '', step, defaultValue }:
    { name: string, type: string, placeholder?: string, required?: boolean | undefined, className?: string | undefined, step?: number, defaultValue?: string | number }
) {
    return (
        <input
            id={name}
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