'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceListDatePicker } from '../service-list/service-list-date-picker';
import { ServiceStatusSelector } from '../selectors/service-status-selector';
import { days, weeks } from '@/lib/values';
import { ServicePeriodSelector } from '../selectors/service-period-selector';

export default function SearchForm({ isServiceDayComponent = false }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [serviceWeek, setServiceWeek] = useState(
    searchParams.get('week') ? Number(searchParams.get('week')) : ''
  );
  const [serviceDay, setServiceDay] = useState(searchParams.get('day') || '');
  const [serviceDate, setServiceDate] = useState(
    searchParams.get('date') || new Date().toISOString().slice(0, 10)
  );
  const [searchTermIsServiced, setSearchTermIsServiced] = useState(searchParams.get('is_serviced') || '');

  
  useEffect(() => {
    if (isServiceDayComponent && !searchParams.get('date')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('date', serviceDate);
      if (!params.get('page')) params.set('page', '1'); // Ensure page is set
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [isServiceDayComponent, searchParams, router, serviceDate]);

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      else params.delete('search');
      if (!params.get('page')) params.set('page', '1'); // Preserve page
      if (isServiceDayComponent && serviceDate) params.set('date', serviceDate); // Preserve date
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm, router, searchParams, isServiceDayComponent, serviceDate]);

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
      if (name === 'week') setServiceWeek(value);
      if (name === 'day') setServiceDay(value);
      if (name === 'date') setServiceDate(value);
      if (name === 'is_serviced') setSearchTermIsServiced(value);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center bg-white/50 p-2 rounded-sm shadow-lg">
      <input
        name="search"
        className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      {! isServiceDayComponent ?
        <>
          <ServicePeriodSelector
            label="Service Week"
            options={weeks}
            value={serviceWeek?.toString() || ''}
            handleChange={handleChange}
            name="week"
          />
          <ServicePeriodSelector
            label="Service Day"
            options={days}
            value={serviceDay}
            handleChange={handleChange}
            name="day"
          />
        </>
        :
        <>
          <ServiceListDatePicker
            serviceDate={serviceDate}
            onChange={handleChange}
          />
          <ServiceStatusSelector value={searchTermIsServiced} onChange={handleChange} />
        </>
      }
    </div>
  );
}