'use client'
import React from 'react';
import { useCuttingPeriodSearch } from "@/lib/hooks/hooks";

import { days, weeks } from '@/lib/values';

export function CuttingPeriodSelector({
  variant,
}: {
  variant: 'week' | 'day';
}) {
  const { currentPeriod, setCuttingPeriod } = useCuttingPeriodSearch(variant);

  const label = variant === 'week' ? 'Cutting Week' : 'Cutting Day';
  const options = variant === 'week' ? weeks : days;

  return (
    <div className="flex gap-1">
      <label className="flex items-center">{label} </label>
      <select
        name={variant}
        className="w-fit border rounded-sm text-center"
        value={currentPeriod}
        onChange={(e) => setCuttingPeriod(e.target.value)}
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
}