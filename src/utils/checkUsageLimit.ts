/**
 * Server-side utility to check if user can generate content
 * This should be called before any video generation operations
 */

import { createClient } from '@/lib/supabase/server';
import { hasReachedLimit, PLAN_LIMITS } from '@/config/plans';

interface CheckUsageLimitResult {
  canGenerate: boolean;
  error?: string;
  message?: string;
  usage?: {
    videosGenerated: number;
    limit: number | 'unlimited';
    planType: string;
  };
}

export async function checkUsageLimit(): Promise<CheckUsageLimitResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        canGenerate: false,
        error: 'Unauthorized',
        message: 'You must be logged in to generate content',
      };
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return {
        canGenerate: false,
        error: 'Subscription not found',
        message: 'Unable to verify your subscription. Please contact support.',
      };
    }

    // Check subscription status
    if (subscription.status !== 'active') {
      return {
        canGenerate: false,
        error: 'Subscription inactive',
        message: `Your subscription is ${subscription.status}. Please update your payment method or upgrade your plan.`,
      };
    }

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get current usage
    let { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();

    // If no usage record exists, create one
    if (!usage) {
      const { data: newUsage, error: createError } = await supabase
        .from('usage_tracking')
        .insert({
          user_id: user.id,
          month: currentMonth,
          year: currentYear,
          videos_generated: 0,
        })
        .select()
        .single();

      if (createError) {
        return {
          canGenerate: false,
          error: 'Failed to check usage',
          message: 'Unable to verify your usage limits. Please try again.',
        };
      }

      usage = newUsage;
    }

    const planType = subscription.plan_type as keyof typeof PLAN_LIMITS;
    const videosGenerated = usage.videos_generated;
    const limit = PLAN_LIMITS[planType].videosPerMonth;

    // Check if limit reached
    if (hasReachedLimit(planType, videosGenerated)) {
      return {
        canGenerate: false,
        error: 'Limit reached',
        message: `You've reached your monthly limit of ${limit} videos. Upgrade your plan to continue generating content.`,
        usage: {
          videosGenerated,
          limit,
          planType,
        },
      };
    }

    // User can generate content
    return {
      canGenerate: true,
      usage: {
        videosGenerated,
        limit,
        planType,
      },
    };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return {
      canGenerate: false,
      error: 'Internal error',
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}

/**
 * Increment usage after successful content generation
 */
export async function incrementUsage(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/usage/increment', {
      method: 'POST',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update usage',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return {
      success: false,
      error: 'Failed to update usage counter',
    };
  }
}
