'use client';

import { useEffect, useState } from 'react';
import { posthog } from '@/lib/posthog/client';
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

export default function DebugPostHog() {
  const { trackEvent } = usePostHog();
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    setInfo({
      posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY
        ? `${process.env.NEXT_PUBLIC_POSTHOG_KEY.substring(0, 10)}...`
        : 'NOT SET',
      posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'NOT SET',
      isLoaded: posthog.__loaded || false,
      environment: process.env.NODE_ENV,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
    });
  }, []);

  const handleTestEvent = () => {
    trackEvent('test_event_from_debug_page', {
      timestamp: new Date().toISOString(),
      page: 'debug-posthog',
    });
    alert('Test event sent! Check PostHog dashboard -> Live Events');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            PostHog Debug Page
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Configuration Status
              </h2>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">PostHog Key:</span>
                  <span
                    className={
                      info.posthogKey === 'NOT SET'
                        ? 'text-red-600 font-bold'
                        : 'text-green-600'
                    }
                  >
                    {info.posthogKey}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PostHog Host:</span>
                  <span
                    className={
                      info.posthogHost === 'NOT SET'
                        ? 'text-red-600 font-bold'
                        : 'text-green-600'
                    }
                  >
                    {info.posthogHost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PostHog Loaded:</span>
                  <span
                    className={
                      info.isLoaded ? 'text-green-600' : 'text-red-600 font-bold'
                    }
                  >
                    {info.isLoaded ? 'YES ✓' : 'NO ✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="text-gray-900">{info.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current URL:</span>
                  <span className="text-gray-900 truncate max-w-xs">
                    {info.currentUrl}
                  </span>
                </div>
              </div>
            </div>

            {info.posthogKey === 'NOT SET' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  ⚠️ PostHog Not Configured
                </h3>
                <p className="text-red-700 mb-4">
                  The NEXT_PUBLIC_POSTHOG_KEY environment variable is not set.
                </p>
                <div className="bg-white rounded p-4 font-mono text-sm">
                  <p className="text-gray-600 mb-2">Add to your .env.local:</p>
                  <code className="text-gray-900">
                    NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
                    <br />
                    NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
                  </code>
                </div>
              </div>
            )}

            {info.isLoaded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ PostHog is Working!
                </h3>
                <p className="text-green-700 mb-4">
                  PostHog is initialized and tracking events.
                </p>
                <button
                  onClick={handleTestEvent}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Send Test Event
                </button>
                <p className="text-sm text-green-600 mt-2">
                  Click the button above, then check your PostHog dashboard →
                  Live Events
                </p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Troubleshooting Steps
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  Open browser DevTools (F12) → Console tab
                </li>
                <li>
                  Look for &quot;PostHog initialized successfully&quot; message
                </li>
                <li>
                  Check Network tab for requests to{' '}
                  <code className="bg-gray-200 px-1">app.posthog.com</code>
                </li>
                <li>
                  If no PostHog key, check Vercel environment variables
                </li>
                <li>Make sure you redeployed after adding env vars</li>
                <li>
                  Disable browser ad blockers (they can block PostHog)
                </li>
              </ol>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">
                Next Steps
              </h3>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <span>
                    Visit PostHog dashboard →{' '}
                    <a
                      href="https://app.posthog.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      app.posthog.com
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔴</span>
                  <span>Go to Activity → Live Events</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👀</span>
                  <span>
                    You should see events from {info.currentUrl}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
