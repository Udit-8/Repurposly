# Dodo Payments Setup Guide

This guide will help you set up Dodo Payments for Repurposly's premium subscription system.

## Prerequisites

- A Dodo Payments account (sign up at [dodopayments.com](https://dodopayments.com))
- Your Supabase project already configured
- Your Next.js application running

## Step 1: Create Dodo Payments Account

1. Go to [https://dodopayments.com](https://dodopayments.com)
2. Click "Sign Up" and create an account
3. Complete the identity and business verification process
4. Set up your payout method (link bank account)

## Step 2: Get API Keys

1. Login to your Dodo Payments dashboard
2. Navigate to **Settings** → **API Keys**
3. Copy your **Test Mode API Key** for development
4. Later, copy your **Live Mode API Key** for production
5. Add these to your `.env.local` file:
   ```
   DODO_PAYMENTS_API_KEY=your_api_key_here
   ```

## Step 3: Create Subscription Products

You need to create 5 products in Dodo Payments matching your pricing plans:

### 3.1 Starter Monthly ($19/month)
1. Go to **Products** → **Add Product**
2. Product Type: **Subscription**
3. Name: `Repurposly Starter - Monthly`
4. Price: `$19.00 USD` or `₹1,599 INR`
5. Billing Cycle: **Monthly**
6. Copy the Product ID and add to `.env.local`:
   ```
   DODO_PRODUCT_STARTER_MONTHLY=prod_xxxxx
   ```

### 3.2 Starter Yearly ($15/month, billed $180/year)
1. Product Type: **Subscription**
2. Name: `Repurposly Starter - Yearly`
3. Price: `$180.00 USD` or `₹14,999 INR`
4. Billing Cycle: **Yearly**
5. Copy Product ID:
   ```
   DODO_PRODUCT_STARTER_YEARLY=prod_xxxxx
   ```

### 3.3 Creator Monthly ($39/month)
1. Product Type: **Subscription**
2. Name: `Repurposly Creator - Monthly`
3. Price: `$39.00 USD` or `₹3,299 INR`
4. Billing Cycle: **Monthly**
5. Copy Product ID:
   ```
   DODO_PRODUCT_CREATOR_MONTHLY=prod_xxxxx
   ```

### 3.4 Creator Yearly ($29/month, billed $348/year)
1. Product Type: **Subscription**
2. Name: `Repurposly Creator - Yearly`
3. Price: `$348.00 USD` or `₹28,999 INR`
4. Billing Cycle: **Yearly**
5. Copy Product ID:
   ```
   DODO_PRODUCT_CREATOR_YEARLY=prod_xxxxx
   ```

### 3.5 Business (Custom Pricing)
1. Product Type: **One-time** (you'll handle custom pricing manually)
2. Name: `Repurposly Business - Enterprise`
3. Price: `$999.00` (placeholder)
4. Copy Product ID:
   ```
   DODO_PRODUCT_BUSINESS=prod_xxxxx
   ```

## Step 4: Configure Webhooks

1. In Dodo Dashboard, go to **Webhooks** → **Add Endpoint**
2. Webhook URL: `https://yourdomain.com/api/subscription/webhook`
   - For local development, use a tool like [ngrok](https://ngrok.com) or [localtunnel](https://localtunnel.github.io/www/)
   - Example: `https://your-tunnel-url.ngrok.io/api/subscription/webhook`
3. Select the following events:
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
   - ✅ `subscription.active`
   - ✅ `subscription.renewed`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.expired`
   - ✅ `subscription.failed`
4. Copy the **Webhook Secret** and add to `.env.local`:
   ```
   DODO_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Step 5: Test the Integration

### Test in Development Mode

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Set up ngrok to expose your local webhook endpoint:
   ```bash
   ngrok http 3000
   ```

3. Update your Dodo webhook URL with the ngrok URL

4. Test checkout flow:
   - Visit your pricing page
   - Click "Try it free" on any paid plan
   - Complete the checkout process using Dodo's test card numbers
   - Verify webhook events are received and processed

### Dodo Payments Test Cards

For testing in test mode, use these test cards:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

## Step 6: Monitor Webhooks

1. In Dodo Dashboard, go to **Webhooks** → **Events**
2. Monitor incoming webhook events
3. Check your application logs for webhook processing
4. Verify database updates in Supabase

## Step 7: Go Live

When you're ready for production:

1. Switch to **Live Mode** in Dodo Dashboard
2. Create production products (same as test mode)
3. Update `.env.local` with live API keys and product IDs
4. Update webhook URL to your production domain
5. Complete Dodo's verification requirements for live payments

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is publicly accessible
- Verify webhook secret matches in `.env.local`
- Check Dodo Dashboard webhook logs for delivery status

### Checkout session creation fails
- Verify all product IDs are correct
- Check API key has correct permissions
- Review Dodo API error messages in console

### Subscription not updating in database
- Check Supabase service role key is correct
- Verify RLS policies allow service role access
- Review webhook handler logs

## Support

- **Dodo Payments Docs**: [docs.dodopayments.com](https://docs.dodopayments.com)
- **Dodo Support**: Contact through dashboard
- **Technical Issues**: Check [github.com/dodopayments](https://github.com/dodopayments)
