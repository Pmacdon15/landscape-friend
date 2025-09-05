'use client'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export const ServiceListDatePickerFallback = () => {    

     const getWeekNumber = (date: Date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7) % 4 || 4;
    };

    return (
        <DatePicker
            wrapperClassName="custom-datepicker-wrapper"
            portalId="root-portal"
            withPortal                        
            className="border rounded-sm "
            dayClassName={(date) => {
                const week = getWeekNumber(date);
                return week === 1 ? 'bg-blue-200' : week === 2 ? 'bg-green-200' : week === 3 ? 'bg-yellow-200' : 'bg-red-200';
            }}
        />
    );
};