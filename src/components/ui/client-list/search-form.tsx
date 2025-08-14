'use client';
import { ServiceListDatePicker } from '../service-list/service-list-date-picker';
import { ServiceStatusSelector } from '../selectors/service-status-selector';
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector';
import { InvoiceStatusSelector } from '../selectors/invoice-status-selector';

type SearchFormVariant = 'service' | 'invoices' | 'default';

export default function SearchForm({
  variant = 'default'
}: {
  variant?: SearchFormVariant
}) {
  // const {
  //   searchTerm,
  //   cuttingWeek,
  //   cuttingDay,
  //   serviceDate,
  //   searchTermIsServiced,
  //   handleChange,
  // } = useSearchFormLogic(variant === 'service');

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
      {/* <input
        name="search"
        className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      /> */}
      
      {variant === "default" &&
        <>
          <CuttingPeriodSelector
            variant="week"
          />
          <CuttingPeriodSelector
            variant="day"
          />
        </>}
      {variant === 'service' &&
        <>
          <ServiceListDatePicker />
          <ServiceStatusSelector />
        </>}

      {variant === 'invoices' &&
        <InvoiceStatusSelector />}
    </div>
  );
}
