# PostHog Quick Start - 5 Minutes

## 1. Sign Up & Get API Key (2 minutes)

1. Visit [https://posthog.com](https://posthog.com) → **Get started - free**
2. Create project: **"Repurposly"**
3. Copy your **Project API Key** (starts with `phc_`)

## 2. Add to Environment Variables (1 minute)

Add to `.env.local`:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 3. Test Locally (1 minute)

```bash
npm run dev
```

Visit `http://localhost:3000` → Check PostHog dashboard → **Live Events** → See pageviews!

## 4. Add to Vercel (1 minute)

Go to Vercel → Project Settings → Environment Variables → Add:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

Redeploy!

---

## Usage Examples

### Track Custom Events

```typescript
import { usePostHog, EVENTS } from '@/hooks/usePostHog';

function MyComponent() {
  const { trackEvent } = usePostHog();

  const handleClick = () => {
    trackEvent(EVENTS.UPGRADE_BUTTON_CLICKED, {
      plan: 'creator',
      price: 39,
    });
  };

  return <button onClick={handleClick}>Upgrade</button>;
}
```

### Available Events

All predefined in `EVENTS` constant:
- `SIGN_UP_COMPLETED`
- `CONTENT_GENERATION_COMPLETED`
- `CHECKOUT_STARTED`
- `USAGE_LIMIT_REACHED`
- And many more!

See full list in [POSTHOG_SETUP.md](./POSTHOG_SETUP.md)

---

**That's it!** For detailed setup, dashboards, funnels, and best practices, read [POSTHOG_SETUP.md](./POSTHOG_SETUP.md)
