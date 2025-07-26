import { MutationData } from '@/types/types';
import { useState, useEffect } from 'react';

const DEBOUNCE_DELAY = 500; // 500ms


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