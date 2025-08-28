// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  register: any;
  errors: any;
  className?: string;
  min?: string | number;
  step?: string | number;
  valueAsNumber?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  register,
  errors,
  className = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2",
  min,
  step,
  valueAsNumber,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={id}
      {...register(id, { valueAsNumber })}
      className={className}
      min={min}
      step={step}
      aria-invalid={errors[id] ? "true" : "false"}
    />
    {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
  </div>
);

export default InputField;
