'use client';
import { CuttingListDatePicker } from '../service-list/service-list-date-picker';
import { ServiceStatusSelector } from '../selectors/service-status-selector';
import { days, weeks } from '@/lib/values';
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector';
import { useSearchFormLogic } from '@/hooks/hooks';

export default function SearchForm({
  isCuttingDayComponent = false,
  isClearingDayComponent = false,
  isInvoicesComponent = false
}) {
  const {
    searchTerm,
    cuttingWeek,
    cuttingDay,
    serviceDate,
    searchTermIsServiced,
    handleChange,
  } = useSearchFormLogic(isCuttingDayComponent);

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
      <input
        name="search"
        className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      {isCuttingDayComponent &&
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
      }
      {isClearingDayComponent &&
        <>
          <CuttingListDatePicker
            cuttingDate={serviceDate}
            onChange={handleChange}
          />
          <ServiceStatusSelector value={searchTermIsServiced} onChange={handleChange} />
        </>
      }
      
      {isInvoicesComponent &&
        <div>text</div>
      } 
    </div>
  );
}
