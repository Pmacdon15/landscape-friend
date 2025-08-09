'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CuttingListDatePicker } from '../service-list/service-list-date-picker';
import { ServiceStatusSelector } from '../selectors/service-status-selector';
import { days, weeks } from '@/lib/values';
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector';

export default function SearchForm({
  isCuttingDayComponent = false,
  snow = false
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [cuttingWeek, setCuttingWeek] = useState(
    searchParams.get('week') ? Number(searchParams.get('week')) : ''
  );
  const [cuttingDay, setCuttingDay] = useState(searchParams.get('day') || '');
  const [serviceDate, setServiceDate] = useState(
    searchParams.get('date') || new Date().toISOString().slice(0, 10)
  );
  const [searchTermIsServiced, setSearchTermIsServiced] = useState(searchParams.get('is_serviced') || '');

  useEffect(() => {
    if (isCuttingDayComponent && !searchParams.get('date')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('date', serviceDate);
      if (!params.get('page')) params.set('page', '1');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [isCuttingDayComponent, searchParams, router, serviceDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      else params.delete('search');
      if (!params.get('page')) params.set('page', '1');
      if (isCuttingDayComponent && serviceDate) params.set('date', serviceDate);
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm, router, searchParams, isCuttingDayComponent, serviceDate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (name === 'search') {
      setSearchTerm(value);
      setDebouncedSearchTerm(value);
    } else {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      switch (name) {
        case 'week':
          setCuttingWeek(value);
          break;
        case 'day':
          setCuttingDay(value);
          break;
        case 'date':
          setServiceDate(value);
          break;
        case 'is_serviced':
          setSearchTermIsServiced(value);
          break;
        default:
          break;
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
      <input
        name="search"
        className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      {isCuttingDayComponent ? (
        snow ? (
          <ServiceStatusSelector value={searchTermIsServiced} onChange={handleChange} />
        ) : (
          <>
            <CuttingListDatePicker
              cuttingDate={serviceDate}
              onChange={handleChange}
            />
            <ServiceStatusSelector value={searchTermIsServiced} onChange={handleChange} />
          </>
        )
      ) : (
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
      )}
    </div>
  );
}