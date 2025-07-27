'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [cuttingWeek, setCuttingWeek] = useState(
        searchParams.get('week') ? Number(searchParams.get('week')) : ''
    );
    const [cuttingDay, setCuttingDay] = useState(searchParams.get('day') || '');

    // Debounce effect for search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());            
            if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
            else params.delete('search');
            router.replace(`?${params.toString()}`, { scroll: false });
        }, 500); // 500ms debounce

        return () => clearTimeout(timeout);
    }, [debouncedSearchTerm, router, searchParams]);

    // Immediate update for week and day
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const params = new URLSearchParams(searchParams.toString());
        params.set('clientListPage', '1'); // Reset clientListPage to 1

        switch (name) {
            case 'search':
                setSearchTerm(value);
                setDebouncedSearchTerm(value);
                break;

            case 'week':
                setCuttingWeek(value);
                value ? params.set('week', value) : params.delete('week');
                router.replace(`?${params.toString()}`, { scroll: false });
                break;

            case 'day':
                setCuttingDay(value);
                value ? params.set('day', value) : params.delete('day');
                router.replace(`?${params.toString()}`, { scroll: false });
                break;

            default:
                break;
        }

        if (name === 'search') {
            // No need to update params for search here since it's handled by the debounce effect
            return;
        }
    };
    return (
        <div className="flex gap-2">
            <input
                name="search"
                className="border rounded-sm p-2"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
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
                        <option key={week} value={week}>
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
                        <option className="text-left" key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
