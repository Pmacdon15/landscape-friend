import { MutationData } from '@/types/types';
import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

export const useDebouncedMutation = (mutate: (data: MutationData) => void, delay: number = 500) => {
  const [value, setValue] = useState<MutationData | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) mutate(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, mutate, delay]);

  return setValue;
};

export function useDebouncedSearchSync(searchTerm: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, router, searchParams]);
}

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}