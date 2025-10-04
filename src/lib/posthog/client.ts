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
      try {
        console.log('Initializing PostHog with key:', posthogKey.substring(0, 10) + '...');

        posthog.init(posthogKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          loaded: (ph) => {
            console.log('✅ PostHog loaded callback triggered');
            console.log('PostHog initialized successfully', {
              host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
              env: process.env.NODE_ENV,
              loaded: ph.__loaded,
            });
          },
          capture_pageview: false,
          capture_pageleave: true,
          persistence: 'localStorage+cookie',
          autocapture: true,
          disable_session_recording: false,
          session_recording: {
            maskAllInputs: true,
            maskTextSelector: '*',
          },
        });

        // Give PostHog a moment to initialize
        setTimeout(() => {
          console.log('PostHog status after init:', {
            loaded: posthog.__loaded,
            config: posthog.config,
          });
        }, 1000);
      } catch (error) {
        console.error('❌ Error initializing PostHog:', error);
      }
    } else {
      console.log('PostHog already loaded');
    }
  }
  return posthog;
}

export { posthog };
