'use client';

import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    // Check if PostHog key is available
    if (!posthogKey) {
      console.warn('PostHog key not found. Analytics will not be tracked.');
      return posthog;
    }

    if (!posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: () => {
          console.log('PostHog initialized successfully', {
            host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
            env: process.env.NODE_ENV,
          });
        },
        capture_pageview: false, // We'll manually capture pageviews
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        autocapture: {
          dom_event_allowlist: ['click', 'change', 'submit'],
        },
      });
    }
  }
  return posthog;
}

export { posthog };
