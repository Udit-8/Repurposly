# PostHog Not Tracking on Production - Troubleshooting Guide

## Quick Diagnosis

Visit your debug page on production:
**https://repurposly.com/debug-posthog**

This page will show you:
- ✅ Whether PostHog key is set
- ✅ Whether PostHog is initialized
- ✅ Current environment details
- ✅ Ability to send test events

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set in Vercel

**Symptoms:**
- Debug page shows "PostHog key NOT SET"
- No events in PostHog dashboard
- Console warning: "PostHog key not found"

**Solution:**
1. Go to Vercel Dashboard: https://vercel.com/udits-projects-d9e5585a/repurposly/settings/environment-variables
2. Verify these variables exist for **Production**:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
3. If missing, add them:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
4. **Important**: Click the checkboxes for Production, Preview, AND Development
5. Redeploy your app (automatic if connected to GitHub, or run `vercel --prod`)

### Issue 2: Wrong PostHog Project Key

**Symptoms:**
- PostHog shows as "loaded" on debug page
- But no events appear in PostHog dashboard

**Solution:**
1. Go to PostHog: https://app.posthog.com
2. Click Settings → Project → Project Settings
3. Copy your **Project API Key** (starts with `phc_`)
4. Verify it matches what's in Vercel
5. If different, update Vercel and redeploy

### Issue 3: Ad Blocker Blocking PostHog

**Symptoms:**
- Works on localhost
- Doesn't work on production
- Browser console shows network errors to `app.posthog.com`

**Solution:**
1. Disable browser ad blockers (uBlock Origin, Adblock Plus, etc.)
2. Try in incognito/private mode
3. Try a different browser
4. Check browser console (F12) → Network tab for blocked requests

### Issue 4: Vercel Build Using Cached Environment Variables

**Symptoms:**
- You added env vars but still not working
- Debug page shows old/missing values

**Solution:**
1. Go to Vercel → Deployments
2. Find latest deployment
3. Click "..." → "Redeploy"
4. ✅ Make sure to check "Use existing Build Cache" is **UNCHECKED**
5. Click "Redeploy"

### Issue 5: Content Security Policy (CSP) Blocking PostHog

**Symptoms:**
- Console errors about CSP violations
- Requests to PostHog blocked

**Solution:**
Check if you have CSP headers in `next.config.js` or middleware. If yes, add:
```javascript
'connect-src': ['https://app.posthog.com', 'https://us.i.posthog.com']
```

### Issue 6: PostHog Project is Paused/Inactive

**Symptoms:**
- Everything looks configured correctly
- Events not appearing in dashboard

**Solution:**
1. Go to PostHog dashboard
2. Check project status (top right)
3. If paused, activate it
4. Check billing is up to date

## Step-by-Step Debugging Process

### Step 1: Check Browser Console (Production)

1. Visit https://repurposly.com
2. Open DevTools (F12) → Console tab
3. Look for messages:
   - ✅ **Good**: "PostHog initialized successfully"
   - ❌ **Bad**: "PostHog key not found" or no message

### Step 2: Check Network Tab

1. In DevTools → Network tab
2. Filter by "posthog" or "i.posthog"
3. Look for requests to `app.posthog.com`
4. Check if they're:
   - ✅ Status 200 (success)
   - ❌ Status 0 or blocked (ad blocker)
   - ❌ 401/403 (wrong API key)

### Step 3: Verify Environment Variables

Run this command to check what Vercel has:
```bash
vercel env pull .env.production
cat .env.production | grep POSTHOG
```

Should show:
```
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxx..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### Step 4: Test with Debug Page

1. Visit: https://repurposly.com/debug-posthog
2. Check all status indicators
3. Click "Send Test Event" button
4. Go to PostHog → Live Events
5. You should see `test_event_from_debug_page` within 10 seconds

### Step 5: Check PostHog Dashboard

1. Go to https://app.posthog.com
2. Select your "Repurposly" project
3. Go to **Activity** → **Live Events**
4. Filter by hostname: `repurposly.com`
5. You should see events streaming in

## Verification Checklist

- [ ] PostHog env vars are set in Vercel for **Production** environment
- [ ] PostHog API key starts with `phc_`
- [ ] Vercel deployment completed successfully
- [ ] Debug page shows "PostHog is Working!"
- [ ] Browser console shows "PostHog initialized successfully"
- [ ] Network tab shows successful requests to `app.posthog.com`
- [ ] Ad blockers are disabled
- [ ] PostHog dashboard shows events from `repurposly.com`

## Still Not Working?

### Check These:

1. **Deployment Status**
   - Go to Vercel → Deployments
   - Make sure latest deployment succeeded
   - Check deployment logs for errors

2. **Cache Issues**
   - Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Try incognito mode

3. **DNS/Domain Issues**
   - Make sure `repurposly.com` is properly pointed to Vercel
   - Check if site is accessible at all

4. **PostHog Free Tier Limits**
   - PostHog free tier: 1M events/month
   - Check if you've hit the limit
   - Go to PostHog → Settings → Billing

## Quick Fixes

### Fix 1: Force Redeploy with Fresh Cache
```bash
cd repurposly
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Fix 2: Pull Latest Env Vars Locally
```bash
vercel env pull
npm run dev
# Test on localhost first
```

### Fix 3: Verify PostHog SDK Version
```bash
npm list posthog-js
# Should be latest version
npm update posthog-js
```

## Expected Behavior

Once working correctly, you should see:

**On Production (repurposly.com):**
- Console message: "PostHog initialized successfully"
- Network requests to `app.posthog.com/e/` every few seconds
- Debug page shows all green checkmarks

**In PostHog Dashboard:**
- Events appearing in real-time
- `$pageview` events with `$current_url: "https://repurposly.com/..."`
- User identified after login with email property

## Contact Support

If you've tried everything above and it's still not working:

1. **Screenshot** the debug page: https://repurposly.com/debug-posthog
2. **Screenshot** browser console errors
3. **Screenshot** PostHog dashboard showing no events
4. **Check** Vercel deployment logs for errors

Common root causes are always:
- ❌ Env vars not set in Vercel
- ❌ Wrong API key
- ❌ Ad blocker enabled
- ❌ Forgot to redeploy after adding env vars

## Success Indicators

You'll know it's working when:
- ✅ Visit https://repurposly.com
- ✅ Open PostHog → Live Events
- ✅ See events appearing within 5-10 seconds
- ✅ Events have proper `$current_url` with production domain
- ✅ Can filter by `$host = repurposly.com`

Good luck! 🚀
