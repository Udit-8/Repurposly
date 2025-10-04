'use client';

import { useState, useEffect } from 'react';
import { PlanType } from '@/config/plans';

interface UsageLimitsData {
  planType: PlanType;
  planName: string;
  videosGenerated: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
  limitReached: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string;
  };
}

interface UseUsageLimitsReturn {
  data: UsageLimitsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsageLimits(): UseUsageLimitsReturn {
  const [data, setData] = useState<UsageLimitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageLimits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/usage/check');

      if (!response.ok) {
        throw new Error('Failed to fetch usage limits');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching usage limits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageLimits();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchUsageLimits,
  };
}
