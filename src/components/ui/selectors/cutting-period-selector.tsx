import { CuttingPeriodSelectorProps } from '@/types/types';
import React from 'react';

export const CuttingPeriodSelector: React.FC<CuttingPeriodSelectorProps> = ({
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