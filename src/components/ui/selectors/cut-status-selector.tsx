'use client'
import { CutStatusSelectorProps } from '@/types/types';
import React from 'react';

export const CutStatusSelector: React.FC<CutStatusSelectorProps> = ({ value, onChange }) => {
    return (
        <select
            name="is_cut"
            className="w-fit border rounded-sm text-center"
            value={value}
            onChange={onChange}
        >
            <option value="false">Uncut</option>
            <option value="true">Cut</option>
        </select>
    );
};
