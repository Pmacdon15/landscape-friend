import { ServiceListDatePicker } from '../service-list/service-list-date-picker';
import { ServiceStatusSelector } from '../selectors/service-status-selector';
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector';
import { InvoiceStatusSelector } from '../selectors/invoice-status-selector';
import { SearchInput } from '../inputs/search-input';

type SearchFormVariant = 'service' | 'invoices' | 'default';

export default function SearchForm({ variant = 'default' }: { variant?: SearchFormVariant }) {
  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
      <SearchInput />
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
