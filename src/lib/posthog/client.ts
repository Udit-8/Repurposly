'use client';

import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog initialized');
          }
        },
        capture_pageview: false, // We'll manually capture pageviews
        capture_pageleave: true,
        autocapture: true,
      });
    }
  }
  return posthog;
}

export { posthog };
