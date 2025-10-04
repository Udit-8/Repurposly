import { DodoPayments } from 'dodopayments';

// Initialize Dodo Payments client
export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

// Dodo Payments Product IDs (these should be created in Dodo Dashboard)
export const DODO_PRODUCT_IDS = {
  starter_monthly: process.env.DODO_PRODUCT_STARTER_MONTHLY!,
  starter_yearly: process.env.DODO_PRODUCT_STARTER_YEARLY!,
  creator_monthly: process.env.DODO_PRODUCT_CREATOR_MONTHLY!,
  creator_yearly: process.env.DODO_PRODUCT_CREATOR_YEARLY!,
  business: process.env.DODO_PRODUCT_BUSINESS!, // Contact sales
};
