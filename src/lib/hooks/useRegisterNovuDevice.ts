'use client'

import { useState, useCallback } from 'react';
import { registerNovuDevice } from '@/DAL/actions/novu';

export function useRegisterNovuDevice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const registerDevice = useCallback(async (token: string, subscriberId: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      const result = await registerNovuDevice(token, subscriberId);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { registerDevice, isLoading, error, isSuccess };
}
