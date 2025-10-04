'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, posthog } from '@/lib/posthog/client';
import { useAuth } from '@/contexts/AuthContext';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageviews
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize PostHog
    initPostHog();
  }, []);

  useEffect(() => {
    // Identify user when authenticated
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        created_at: user.created_at,
      });
    } else {
      // Reset on logout
      posthog.reset();
    }
  }, [user]);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
