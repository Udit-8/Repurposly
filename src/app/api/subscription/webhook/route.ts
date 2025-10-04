import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role client for webhook operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface DodoWebhookEvent {
  event_type: string;
  data: {
    customer_id?: string;
    customer_email?: string;
    subscription_id?: string;
    payment_id?: string;
    status?: string;
    metadata?: {
      user_id?: string;
      plan_type?: string;
      billing_cycle?: string;
    };
    subscription?: {
      id: string;
      status: string;
      current_period_start: string;
      current_period_end: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature (Dodo sends this in headers)
    const signature = req.headers.get('webhook-signature');
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // TODO: Implement proper signature verification based on Dodo's method
    // For now, we'll proceed with a basic check

    const event: DodoWebhookEvent = await req.json();
    const eventType = event.event_type;

    console.log(`Received webhook event: ${eventType}`);

    // Handle different event types
    switch (eventType) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'subscription.active':
        await handleSubscriptionActive(event);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(event);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(event);
        break;

      case 'subscription.failed':
        await handleSubscriptionFailed(event);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(event: DodoWebhookEvent) {
  const userId = event.data.metadata?.user_id;
  const planType = event.data.metadata?.plan_type;

  if (!userId || !planType) {
    console.error('Missing user_id or plan_type in webhook metadata');
    return;
  }

  console.log(`Payment succeeded for user ${userId}, plan: ${planType}`);
}

async function handleSubscriptionActive(event: DodoWebhookEvent) {
  const userId = event.data.metadata?.user_id;
  const planType = event.data.metadata?.plan_type;
  const subscription = event.data.subscription;
  const customerId = event.data.customer_id;

  if (!userId || !planType || !subscription) {
    console.error('Missing required data in subscription.active webhook');
    return;
  }

  // Update or create subscription in database
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      dodo_subscription_id: subscription.id,
      dodo_customer_id: customerId,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log(`Subscription activated for user ${userId}`);
  }
}

async function handleSubscriptionRenewed(event: DodoWebhookEvent) {
  const subscription = event.data.subscription;

  if (!subscription) {
    console.error('Missing subscription data in renewal webhook');
    return;
  }

  // Update subscription period dates
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('dodo_subscription_id', subscription.id);

  if (error) {
    console.error('Error renewing subscription:', error);
  } else {
    console.log(`Subscription renewed: ${subscription.id}`);
  }
}

async function handleSubscriptionCancelled(event: DodoWebhookEvent) {
  const subscription = event.data.subscription;

  if (!subscription) {
    console.error('Missing subscription data in cancellation webhook');
    return;
  }

  // Update subscription status to cancelled
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('dodo_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
  } else {
    console.log(`Subscription cancelled: ${subscription.id}`);
  }
}

async function handleSubscriptionExpired(event: DodoWebhookEvent) {
  const subscription = event.data.subscription;
  const userId = event.data.metadata?.user_id;

  if (!subscription) {
    console.error('Missing subscription data in expiration webhook');
    return;
  }

  // Update subscription status to expired and downgrade to free
  const { error: subError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('dodo_subscription_id', subscription.id);

  if (subError) {
    console.error('Error expiring subscription:', subError);
  }

  // Create a new free subscription for the user
  if (userId) {
    const { error: freeSubError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

    if (freeSubError) {
      console.error('Error creating free subscription:', freeSubError);
    } else {
      console.log(`User ${userId} downgraded to free plan`);
    }
  }
}

async function handleSubscriptionFailed(event: DodoWebhookEvent) {
  const subscription = event.data.subscription;

  if (!subscription) {
    console.error('Missing subscription data in failed webhook');
    return;
  }

  // Update subscription status to past_due
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('dodo_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating failed subscription:', error);
  } else {
    console.log(`Subscription marked as past_due: ${subscription.id}`);
  }
}

async function handlePaymentFailed(event: DodoWebhookEvent) {
  const subscriptionId = event.data.subscription_id;

  if (!subscriptionId) {
    console.log('Payment failed for one-time purchase');
    return;
  }

  console.log(`Payment failed for subscription: ${subscriptionId}`);
  // The subscription.failed event will handle the status update
}
