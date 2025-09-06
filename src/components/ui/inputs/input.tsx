import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    name: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    step?: number;
    defaultValue?: string | number;
    error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
    ({
        name,
        type,
        placeholder,
        required = false,
        className = '',
        step,
        defaultValue,
        error,
        ...rest
    }, ref) => {

        if (type === "textarea") {
            return (
                <div className="flex flex-col w-full">
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        className={`border rounded h-46 md:h-36 sm p-1 bg-white ${className} ${error ? 'border-red-500' : ''}`}
                        defaultValue={defaultValue as string}
                        ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                        {...rest}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
            );
        }

        return (
            <div className="flex flex-col w-full">
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={`border rounded sm p-1 bg-white ${className} ${error ? 'border-red-500' : ''}`}
                    step={step || 1}
                    defaultValue={defaultValue}
                    ref={ref as React.ForwardedRef<HTMLInputElement>}
                    {...rest}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';
