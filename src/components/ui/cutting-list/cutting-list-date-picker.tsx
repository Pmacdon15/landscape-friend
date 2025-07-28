'use client'
import { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export const CuttingListDatePicker = ({ cuttingDate, value, onChange }: { cuttingDate: string, value: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    // Parse cuttingDate as a local date
    const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-based in JS Date
    };

    const [date, setDate] = useState(parseLocalDate(cuttingDate));

    const getWeekNumber = (date: Date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7) % 4 || 4;
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Format as local YYYY-MM-DD
            const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const event = {
                target: {
                    name: 'date',
                    value: localDateStr,
                },
            };
            onChange(event as React.ChangeEvent<HTMLInputElement>);
            setDate(date);
        }
    };

    return (
        <DatePicker
            wrapperClassName="custom-datepicker-wrapper"
            portalId="root-portal"
            withPortal
            selected={date}
            onChange={handleDateChange}
            className="border rounded-sm p-2"
            dayClassName={(date) => {
                const week = getWeekNumber(date);
                return week === 1 ? 'bg-blue-200' : week === 2 ? 'bg-green-200' : week === 3 ? 'bg-yellow-200' : 'bg-red-200';
            }}
        />
    );
};