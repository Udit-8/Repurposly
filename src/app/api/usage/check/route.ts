import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_LIMITS, getRemainingVideos, hasReachedLimit } from '@/config/plans';

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

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get or create usage tracking for current month
    let { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();

    // If no usage record exists for this month, create one
    if (!usage) {
      const { data: newUsage, error: createError } = await supabase
        .from('usage_tracking')
        .insert({
          user_id: user.id,
          month: currentMonth,
          year: currentYear,
          videos_generated: 0,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create usage record' },
          { status: 500 }
        );
      }

      usage = newUsage;
    }

    const planType = subscription.plan_type as keyof typeof PLAN_LIMITS;
    const videosGenerated = usage.videos_generated;
    const limit = PLAN_LIMITS[planType].videosPerMonth;
    const remaining = getRemainingVideos(planType, videosGenerated);
    const limitReached = hasReachedLimit(planType, videosGenerated);

    return NextResponse.json({
      success: true,
      data: {
        planType,
        planName: PLAN_LIMITS[planType].name,
        videosGenerated,
        limit,
        remaining,
        limitReached,
        subscription: {
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
      },
    });
  } catch (error) {
    console.error('Error checking usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
