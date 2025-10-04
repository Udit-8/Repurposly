import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hasReachedLimit, PLAN_LIMITS } from '@/config/plans';

export async function POST() {
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

    // Check if subscription is active
    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 403 }
      );
    }

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get current usage
    let { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();

    // If no usage record exists, create one
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
    const currentUsage = usage.videos_generated;

    // Check if user has reached limit
    if (hasReachedLimit(planType, currentUsage)) {
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message: `You have reached your monthly limit of ${PLAN_LIMITS[planType].videosPerMonth} videos. Please upgrade your plan to continue.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // Increment usage
    const { data: updatedUsage, error: updateError } = await supabase
      .from('usage_tracking')
      .update({
        videos_generated: currentUsage + 1,
        last_updated: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update usage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        videosGenerated: updatedUsage.videos_generated,
        limit: PLAN_LIMITS[planType].videosPerMonth,
      },
    });
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
