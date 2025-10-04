'use client';

import { useState, useEffect } from 'react';
import { PlanType } from '@/config/plans';

interface SubscriptionData {
  id: string;
  planType: PlanType;
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  dodoSubscriptionId: string | null;
  dodoCustomerId: string | null;
  features: string[];
  limit: number | 'unlimited';
  price: { monthly: number; yearly: number } | 'custom';
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/current');

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const result = await response.json();

      if (result.success) {
        setSubscription(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}
