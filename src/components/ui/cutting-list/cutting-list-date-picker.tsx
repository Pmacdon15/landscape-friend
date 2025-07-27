'use client'
import { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export const CuttingListDatePicker = ({ cuttingDate, value, onChange }: { cuttingDate: string, value: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const [date, setDate] = useState(new Date(cuttingDate));

    const getWeekNumber = (date: Date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7) % 4 || 4;
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const event = {
                target: {
                    name: 'date',
                    value: date.toISOString().slice(0, 10),
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