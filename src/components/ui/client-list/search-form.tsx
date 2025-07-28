'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CuttingListDatePicker } from '../cutting-list/cutting-list-date-picker';
import { CutStatusSelector } from '../selectors/cut-status-selector';
import { days, weeks } from '@/lib/values';
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector';

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
  const [searchTermIsCut, setSearchTermIsCut] = useState(searchParams.get('is_cut') || '');

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
      if (name === 'week') setCuttingWeek(value);
      if (name === 'day') setCuttingDay(value);
      if (name === 'date') setCuttingDate(value);
      if (name === 'is_cut') setSearchTermIsCut(value);
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
      {!isCuttingDayComponent ?
        <>
          <CuttingPeriodSelector
            label="Cutting Week"
            options={weeks}
            value={cuttingWeek?.toString() || ''}
            handleChange={handleChange}
            name="week"
          />
          <CuttingPeriodSelector
            label="Cutting Day"
            options={days}
            value={cuttingDay}
            handleChange={handleChange}
            name="day"
          />
        </>
        :
        <>
          <CuttingListDatePicker
            cuttingDate={cuttingDate}
            onChange={handleChange}
          />
          <CutStatusSelector value={searchTermIsCut} onChange={handleChange} />
        </>
      }
    </div>
  );
}