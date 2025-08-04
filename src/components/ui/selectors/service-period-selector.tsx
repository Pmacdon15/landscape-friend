import React from 'react';

interface ServicePeriodSelectorProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}

export const ServicePeriodSelector: React.FC<ServicePeriodSelectorProps> = ({
  label,
  options,
  value,
  handleChange,
  name,
}) => {
  return (
    <div className="flex gap-1">
      <label className="flex items-center">{label} </label>
      <select
        name={name}
        className="w-fit border rounded-sm text-center"
        value={value}
        onChange={handleChange}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};