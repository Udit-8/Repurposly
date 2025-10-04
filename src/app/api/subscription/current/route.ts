import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_LIMITS } from '@/config/plans';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const planType = subscription.plan_type as keyof typeof PLAN_LIMITS;
    const planDetails = PLAN_LIMITS[planType];

    return NextResponse.json({
      success: true,
      data: {
        id: subscription.id,
        planType: subscription.plan_type,
        planName: planDetails.name,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        dodoSubscriptionId: subscription.dodo_subscription_id,
        dodoCustomerId: subscription.dodo_customer_id,
        features: planDetails.features,
        limit: planDetails.videosPerMonth,
        price: planDetails.price,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
