import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

type HandleChangeProps = {
    searchParamsSnapshot: string;
    router: ReturnType<typeof useRouter>;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    setDebouncedSearchTerm: Dispatch<SetStateAction<string>>;
    setCuttingWeek: Dispatch<SetStateAction<string>>;
    setCuttingDay: Dispatch<SetStateAction<string>>;
};

export function createSearchFormHandler({
    searchParamsSnapshot,
    router,
    setSearchTerm,
    setDebouncedSearchTerm,
    setCuttingWeek,
    setCuttingDay,
}: HandleChangeProps) {
    return function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        const params = new URLSearchParams(searchParamsSnapshot);

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
    };
}
