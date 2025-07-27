'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm({ isCuttingDayComponent = false }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [cuttingWeek, setCuttingWeek] = useState(
    searchParams.get('week') ? Number(searchParams.get('week')) : ''
  );
  const [cuttingDay, setCuttingDay] = useState(searchParams.get('day') || '');
  const [cuttingDate, setCuttingDate] = useState(
    searchParams.get('date') || new Date().toISOString().slice(0, 10)
  );

  // Set the date parameter on component mount if isCuttingDayComponent is true
  useEffect(() => {
    if (isCuttingDayComponent && !searchParams.get('date')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('date', cuttingDate);
      if (!params.get('page')) params.set('page', '1'); // Ensure page is set
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [isCuttingDayComponent, searchParams, router, cuttingDate]);

  // Debounce effect for search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      else params.delete('search');
      if (!params.get('page')) params.set('page', '1'); // Preserve page
      if (isCuttingDayComponent && cuttingDate) params.set('date', cuttingDate); // Preserve date
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm, router, searchParams, isCuttingDayComponent, cuttingDate]);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;
  const params = new URLSearchParams(searchParams.toString());
  params.set('page', '1'); // Reset page to 1 on any change

  if (name === 'search') {
    setSearchTerm(value);
    setDebouncedSearchTerm(value);
  } else {
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setCuttingWeek(name === 'week' ? value : cuttingWeek);
    setCuttingDay(name === 'day' ? value : cuttingDay);
    setCuttingDate(name === 'date' ? value : cuttingDate);
  }

  router.replace(`?${params.toString()}`, { scroll: false });
};

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center ">
      <input
        name="search"
        className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      {!isCuttingDayComponent ? (
        <>
          <div className="flex gap-1">
            <label className="flex items-center">Cutting Week </label>
            <select
              name="week"
              className="w-fit border rounded-sm text-center"
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
          <div className="flex gap-1">
            <label className="flex items-center">Cutting Day </label>
            <select
              name="day"
              className="w-fit border rounded-sm text-center"
              value={cuttingDay}
              onChange={handleChange}
            >
              <option value="">All</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day) => (
                  <option className="text-left" key={day} value={day}>
                    {day}
                  </option>
                )
              )}
            </select>
          </div>
        </>
      ) : (
        <input
          name="date"
          className="border rounded-sm p-2"
          type="date"
          value={cuttingDate}
          onChange={handleChange}
        />
      )}
    </div>
  );
}