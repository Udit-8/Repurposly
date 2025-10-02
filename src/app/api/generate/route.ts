import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { generatePrompts } from '@/utils/prompts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoId } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate prompts
    const prompts = generatePrompts(transcript);

    console.log('🤖 Generating content with OpenAI...');

    // Generate Twitter Thread
    const twitterThreadResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompts.twitterThread
      }]
    });

    const twitterThread = twitterThreadResponse.choices[0]?.message?.content || '';

    // Generate Standalone Tweets
    const tweetsResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompts.standaloneTweets
      }]
    });

    const tweets = tweetsResponse.choices[0]?.message?.content
      ? tweetsResponse.choices[0].message.content.split('\n\n').filter(t => t.trim())
      : [];

    // Generate LinkedIn Post
    const linkedinResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompts.linkedinPost
      }]
    });

    const linkedinPost = linkedinResponse.choices[0]?.message?.content || '';

    // Prepare content for storage
    const generatedContent = {
      twitter_thread: twitterThread,
      tweets: tweets,
      linkedin_post: linkedinPost
    };

    // Store generated content in database
    const { error: insertError } = await supabase
      .from('generated_content')
      .insert({
        user_id: user.id,
        youtube_video_id: videoId || 'unknown',
        twitter_thread: twitterThread,
        tweets: tweets,
        linkedin_post: linkedinPost
      });

    if (insertError) {
      console.error('Error storing generated content:', insertError);
      // Continue anyway - we have the content
    } else {
      console.log('✅ Content stored successfully');
    }

    console.log('✅ Content generation complete');

    return NextResponse.json({
      success: true,
      data: generatedContent
    });

  } catch (error: any) {
    console.error('Content generation error:', error);

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 500 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
