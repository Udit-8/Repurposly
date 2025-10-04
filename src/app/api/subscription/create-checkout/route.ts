import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodoClient, DODO_PRODUCT_IDS } from '@/lib/dodo/client';
import { PlanType } from '@/config/plans';

export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();
    const { planType, billingCycle } = body as {
      planType: PlanType;
      billingCycle: 'monthly' | 'yearly';
    };

    // Validate plan type
    if (!['starter', 'creator', 'business'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Get product ID based on plan and billing cycle
    let productId: string;

    if (planType === 'starter' && billingCycle === 'monthly') {
      productId = DODO_PRODUCT_IDS.starter_monthly;
    } else if (planType === 'starter' && billingCycle === 'yearly') {
      productId = DODO_PRODUCT_IDS.starter_yearly;
    } else if (planType === 'creator' && billingCycle === 'monthly') {
      productId = DODO_PRODUCT_IDS.creator_monthly;
    } else if (planType === 'creator' && billingCycle === 'yearly') {
      productId = DODO_PRODUCT_IDS.creator_yearly;
    } else if (planType === 'business') {
      productId = DODO_PRODUCT_IDS.business;
    } else {
      return NextResponse.json(
        { error: 'Invalid plan configuration' },
        { status: 400 }
      );
    }

    // Create checkout session with Dodo Payments
    const checkoutSession = await dodoClient.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: checkoutSession.session_id,
        checkoutSession: checkoutSession,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
