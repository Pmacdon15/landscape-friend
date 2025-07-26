'use client'
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [cuttingWeek, setCuttingWeek] = useState(searchParams.get('week') || '');
    const [cuttingDay, setCuttingDay] = useState(searchParams.get('day') || '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(name, value);
        else params.delete(name);
        router.replace(`?${params.toString()}`, { scroll: false });
        if (name === 'search') setSearchTerm(value);
        if (name === 'week') setCuttingWeek(value);
        if (name === 'day') setCuttingDay(value);
    }

    return (
        <div className="flex gap-2">
            <input
                name="search"
                className="border rounded-sm p-2"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange} />
            <div className="flex gap-2">
                <label className="flex items-center">Cutting Week </label>
                <select 
                    name="week"
                    className="w-10 border rounded-sm text-center"
                    value={cuttingWeek}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    {[1, 2, 3, 4].map((week) => (
                        <option  key={week} value={week}>
                            {week}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <label className="flex items-center">Cutting Day </label>
                <select 
                    name="day"
                    className="w-28 border rounded-sm text-center"
                    value={cuttingDay}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <option className='text-left' key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}