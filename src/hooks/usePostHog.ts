'use client';

import { posthog } from '@/lib/posthog/client';

export function usePostHog() {
  const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, properties);
    }
  };

  const identifyUser = (
    userId: string,
    properties?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, properties);
    }
  };

  const resetUser = () => {
    if (typeof window !== 'undefined') {
      posthog.reset();
    }
  };

  return {
    trackEvent,
    identifyUser,
    resetUser,
    posthog,
  };
}

// Predefined event names for consistency
export const EVENTS = {
  // Authentication
  SIGN_UP_STARTED: 'sign_up_started',
  SIGN_UP_COMPLETED: 'sign_up_completed',
  SIGN_IN_STARTED: 'sign_in_started',
  SIGN_IN_COMPLETED: 'sign_in_completed',
  SIGN_OUT: 'sign_out',

  // Content Generation
  VIDEO_TRANSCRIPT_FETCHED: 'video_transcript_fetched',
  CONTENT_GENERATION_STARTED: 'content_generation_started',
  CONTENT_GENERATION_COMPLETED: 'content_generation_completed',
  CONTENT_GENERATION_FAILED: 'content_generation_failed',

  // Subscription & Billing
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  UPGRADE_BUTTON_CLICKED: 'upgrade_button_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_CANCELLED: 'checkout_cancelled',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Usage Limits
  USAGE_LIMIT_REACHED: 'usage_limit_reached',
  USAGE_LIMIT_WARNING: 'usage_limit_warning', // 80% used

  // Navigation
  DASHBOARD_VIEWED: 'dashboard_viewed',
  LANDING_PAGE_VIEWED: 'landing_page_viewed',
  CTA_CLICKED: 'cta_clicked',

  // Features
  COPY_CONTENT_CLICKED: 'copy_content_clicked',
  DOWNLOAD_CONTENT_CLICKED: 'download_content_clicked',
  SHARE_CONTENT_CLICKED: 'share_content_clicked',
} as const;
