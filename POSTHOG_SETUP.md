# PostHog Analytics Setup Guide

PostHog is a complete product analytics platform that helps you understand user behavior, track events, and make data-driven decisions.

## Step 1: Create PostHog Account

1. Go to [https://posthog.com](https://posthog.com)
2. Click **"Get started - free"**
3. Sign up with your email or GitHub account
4. Choose **PostHog Cloud** (recommended for ease of setup)

## Step 2: Create a Project

1. After signing in, you'll be prompted to create your first project
2. Enter project details:
   - **Project Name**: `Repurposly`
   - **Organization Name**: Your company name
   - **Industry**: SaaS / Content Creation
3. Click **"Create Project"**

## Step 3: Get Your API Keys

1. In the PostHog dashboard, click on **Settings** (gear icon)
2. Go to **Project** → **Project Settings**
3. Copy your **Project API Key** (starts with `phc_`)
4. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

## Step 4: Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your app at `http://localhost:3000`

3. Check PostHog dashboard:
   - Go to **Activity** → **Live Events**
   - You should see `$pageview` events appearing

## Step 5: Configure Event Tracking

The integration is already set up in your codebase! Here's what's tracked automatically:

### Automatic Events
- ✅ **Pageviews**: All page navigations
- ✅ **Page leaves**: When users leave pages
- ✅ **User identification**: Logged-in users are identified with their email
- ✅ **Autocapture**: Button clicks and form submissions

### Custom Events (Already Configured)
You can track custom events using the `usePostHog` hook:

```typescript
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

function MyComponent() {
  const { trackEvent } = usePostHog();

  const handleUpgrade = () => {
    trackEvent(EVENTS.UPGRADE_BUTTON_CLICKED, {
      plan: 'creator',
      price: 39,
    });
  };

  return <button onClick={handleUpgrade}>Upgrade</button>;
}
```

### Predefined Events Available

**Authentication:**
- `sign_up_started`
- `sign_up_completed`
- `sign_in_started`
- `sign_in_completed`
- `sign_out`

**Content Generation:**
- `video_transcript_fetched`
- `content_generation_started`
- `content_generation_completed`
- `content_generation_failed`

**Subscription & Billing:**
- `pricing_page_viewed`
- `upgrade_button_clicked`
- `checkout_started`
- `checkout_completed`
- `checkout_cancelled`
- `subscription_upgraded`
- `subscription_cancelled`

**Usage Limits:**
- `usage_limit_reached`
- `usage_limit_warning`

**Navigation:**
- `dashboard_viewed`
- `landing_page_viewed`
- `cta_clicked`

**Features:**
- `copy_content_clicked`
- `download_content_clicked`
- `share_content_clicked`

## Step 6: Add Event Tracking to Your Components

### Example 1: Track Sign-Up Flow

Update `src/app/signup/page.tsx`:

```typescript
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

export default function SignupPage() {
  const { trackEvent } = usePostHog();

  const handleGoogleSignIn = async () => {
    trackEvent(EVENTS.SIGN_UP_STARTED, {
      method: 'google',
    });
    // ... existing sign-in logic
  };

  return (
    // ... your JSX
  );
}
```

### Example 2: Track Content Generation

Update `src/app/dashboard/page.tsx`:

```typescript
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

export default function Dashboard() {
  const { trackEvent } = usePostHog();

  const handleGenerate = async () => {
    trackEvent(EVENTS.CONTENT_GENERATION_STARTED, {
      video_id: videoId,
      video_url: youtubeUrl,
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ youtubeUrl }),
      });

      if (response.ok) {
        trackEvent(EVENTS.CONTENT_GENERATION_COMPLETED, {
          video_id: videoId,
        });
      } else {
        trackEvent(EVENTS.CONTENT_GENERATION_FAILED, {
          video_id: videoId,
          error: 'Generation failed',
        });
      }
    } catch (error) {
      trackEvent(EVENTS.CONTENT_GENERATION_FAILED, {
        video_id: videoId,
        error: error.message,
      });
    }
  };
}
```

### Example 3: Track Pricing Page Views

Update `src/components/landing/PricingSection.tsx`:

```typescript
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

export default function PricingSection() {
  const { trackEvent } = usePostHog();

  useEffect(() => {
    trackEvent(EVENTS.PRICING_PAGE_VIEWED);
  }, []);

  const handleUpgradeClick = (plan: string, price: number) => {
    trackEvent(EVENTS.UPGRADE_BUTTON_CLICKED, {
      plan,
      price,
      billing_cycle: billingCycle,
    });
  };

  return (
    // ... your JSX
  );
}
```

## Step 7: Create Key Metrics Dashboards

In PostHog dashboard:

1. **Go to Insights** → **Create New Insight**

2. **Create these key metrics:**

### User Acquisition Dashboard
- **Sign-ups over time**: Filter `sign_up_completed` events
- **Sign-up conversion rate**: `sign_up_completed` / `sign_up_started`
- **Sign-up methods**: Breakdown by `method` property

### Product Usage Dashboard
- **Videos processed**: Count `content_generation_completed`
- **Success rate**: `content_generation_completed` / `content_generation_started`
- **Average time to first generation**: Time between `sign_up_completed` and first `content_generation_completed`

### Revenue Dashboard
- **Checkout started**: Count `checkout_started` events
- **Checkout completion rate**: `checkout_completed` / `checkout_started`
- **Upgrades by plan**: Breakdown `checkout_completed` by `plan` property
- **MRR growth**: Track subscription events over time

### Engagement Dashboard
- **DAU/MAU**: Daily/Monthly active users
- **Feature usage**: Track `copy_content_clicked`, `download_content_clicked`
- **Usage limit hits**: Count `usage_limit_reached` events

## Step 8: Set Up Alerts

1. Go to **Alerts** in PostHog
2. Create alerts for:
   - Spike in `content_generation_failed` events (>5% failure rate)
   - Drop in daily sign-ups (>20% decrease)
   - Increase in `usage_limit_reached` (opportunity to upsell)

## Step 9: User Funnels

Create conversion funnels in PostHog:

### Sign-Up Funnel
1. `landing_page_viewed`
2. `cta_clicked`
3. `sign_up_started`
4. `sign_up_completed`

### Activation Funnel
1. `sign_up_completed`
2. `dashboard_viewed`
3. `content_generation_started`
4. `content_generation_completed`

### Upgrade Funnel
1. `pricing_page_viewed`
2. `upgrade_button_clicked`
3. `checkout_started`
4. `checkout_completed`

## Step 10: Session Recordings (Optional)

PostHog can record user sessions to see exactly how users interact with your app:

1. Go to **Settings** → **Project** → **Recordings**
2. Enable **Session Recordings**
3. Configure:
   - **Sampling rate**: 100% for development, 10-50% for production
   - **Console logs**: Enable
   - **Network performance**: Enable

⚠️ **Privacy Note**: Make sure to comply with GDPR/privacy laws. Add a cookie consent banner if needed.

## Step 11: Feature Flags (Optional)

Use PostHog feature flags for A/B testing:

```typescript
import { usePostHog } from '@/hooks/usePostHog';

function MyComponent() {
  const { posthog } = usePostHog();
  const showNewFeature = posthog.isFeatureEnabled('new-pricing-page');

  return showNewFeature ? <NewPricing /> : <OldPricing />;
}
```

## Step 12: Add to Vercel

Add PostHog environment variables to Vercel:

1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
4. Make sure to add for **Production**, **Preview**, and **Development**
5. Redeploy your app

## Best Practices

### 1. Consistent Naming
- Use the predefined `EVENTS` constants
- Follow the pattern: `noun_verb` (e.g., `content_generation_started`)

### 2. Meaningful Properties
Always include context:
```typescript
trackEvent(EVENTS.CONTENT_GENERATION_COMPLETED, {
  video_id: videoId,
  video_duration: duration,
  user_plan: 'starter',
  generation_time_ms: 2500,
});
```

### 3. Track Both Success and Failure
```typescript
try {
  await generateContent();
  trackEvent(EVENTS.CONTENT_GENERATION_COMPLETED);
} catch (error) {
  trackEvent(EVENTS.CONTENT_GENERATION_FAILED, {
    error: error.message,
  });
}
```

### 4. Respect Privacy
- Don't track PII (personally identifiable information) unless necessary
- Use user IDs instead of emails in event properties
- Add cookie consent if required by law

### 5. Performance
- PostHog is loaded asynchronously and won't block page rendering
- Events are batched and sent in the background
- No performance impact on user experience

## Troubleshooting

### Events not appearing in PostHog

1. **Check browser console**: Look for PostHog initialization messages
2. **Verify API key**: Ensure `NEXT_PUBLIC_POSTHOG_KEY` is correct
3. **Check adblockers**: Disable ad blockers (they sometimes block analytics)
4. **Clear cache**: Hard refresh your browser
5. **Check PostHog status**: Visit [status.posthog.com](https://status.posthog.com)

### User not being identified

```typescript
// Manually identify user
const { identifyUser } = usePostHog();

useEffect(() => {
  if (user) {
    identifyUser(user.id, {
      email: user.email,
      plan: user.subscription.plan_type,
    });
  }
}, [user]);
```

### Events triggering multiple times

- Make sure `trackEvent` is not inside a re-rendering loop
- Use `useEffect` with proper dependencies
- Check that event handlers aren't being called multiple times

## Useful PostHog Features

- **Cohorts**: Group users by behavior (e.g., "Power users who generated >10 videos")
- **Correlation Analysis**: Find which actions lead to conversions
- **Retention**: Track how many users come back day after day
- **Paths**: See common user journeys through your app
- **Experiments**: Run A/B tests directly in PostHog

## Support Resources

- **PostHog Docs**: [posthog.com/docs](https://posthog.com/docs)
- **Community Slack**: Join PostHog community
- **Tutorial Videos**: PostHog YouTube channel
- **Support**: support@posthog.com

---

**That's it!** You now have comprehensive analytics for Repurposly. Start making data-driven decisions! 📊
