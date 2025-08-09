'use client'
import { CutStatusSelectorProps } from '@/types/types';
import React from 'react';

export const ServiceStatusSelector: React.FC<CutStatusSelectorProps> = ({ value, onChange }) => {
    return (
        <select
            name="is_serviced"
            className="w-fit border rounded-sm text-center"
            value={value}
            onChange={onChange}
        >
            <option value="false">Un-serviced</option>
            <option value="true">Serviced</option>
        </select>
    );
};
