export type PlanType = 'free' | 'starter' | 'creator' | 'business';

export interface PlanLimits {
  name: string;
  videosPerMonth: number | 'unlimited';
  features: string[];
  price: {
    monthly: number;
    yearly: number;
  } | 'custom';
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    name: 'Free',
    videosPerMonth: 3,
    features: [
      '3 videos/month',
      'Basic content generation',
      'Twitter & LinkedIn posts',
      'Email support',
    ],
    price: {
      monthly: 0,
      yearly: 0,
    },
  },
  starter: {
    name: 'Starter',
    videosPerMonth: 30,
    features: [
      '30 videos/month',
      'Ideas generator',
      'Multi-format export',
      'Scheduling & tags',
      'Email support',
    ],
    price: {
      monthly: 19,
      yearly: 15,
    },
  },
  creator: {
    name: 'Creator',
    videosPerMonth: 'unlimited',
    features: [
      'Unlimited videos',
      'Content inspirations',
      'Analytics dashboard',
      'Priority support',
      'API access',
      'Team collaboration',
    ],
    price: {
      monthly: 39,
      yearly: 29,
    },
  },
  business: {
    name: 'Business',
    videosPerMonth: 'unlimited',
    features: [
      'Unlimited videos',
      'Multi-account management',
      'Custom reports',
      'Dedicated manager',
      'Priority chat support',
      'White-label options',
    ],
    price: 'custom',
  },
};

/**
 * Check if user has reached their monthly limit
 */
export function hasReachedLimit(
  planType: PlanType,
  videosGenerated: number
): boolean {
  const limit = PLAN_LIMITS[planType].videosPerMonth;

  if (limit === 'unlimited') {
    return false;
  }

  return videosGenerated >= limit;
}

/**
 * Get remaining videos for current billing period
 */
export function getRemainingVideos(
  planType: PlanType,
  videosGenerated: number
): number | 'unlimited' {
  const limit = PLAN_LIMITS[planType].videosPerMonth;

  if (limit === 'unlimited') {
    return 'unlimited';
  }

  const remaining = limit - videosGenerated;
  return remaining > 0 ? remaining : 0;
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(planType: PlanType): string {
  return PLAN_LIMITS[planType].name;
}

/**
 * Calculate price based on billing cycle
 */
export function getPlanPrice(
  planType: PlanType,
  billingCycle: 'monthly' | 'yearly'
): number | 'custom' {
  const price = PLAN_LIMITS[planType].price;

  if (price === 'custom') {
    return 'custom';
  }

  return price[billingCycle];
}
