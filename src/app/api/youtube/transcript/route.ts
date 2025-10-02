import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from '@danielxceron/youtube-transcript';
import { createClient } from '@/lib/supabase/server';
import { extractVideoId } from '@/utils/youtube';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
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

    // Check if transcript already exists in cache
    const { data: existingTranscript } = await supabase
      .from('transcripts')
      .select('*')
      .eq('youtube_video_id', videoId)
      .single();

    if (existingTranscript) {
      console.log('✅ Transcript found in cache:', videoId);
      return NextResponse.json({
        success: true,
        data: {
          videoId,
          transcript: existingTranscript.transcript_text,
          videoTitle: existingTranscript.video_title,
          videoDuration: existingTranscript.video_duration,
          cached: true
        }
      });
    }

    // Fetch transcript from YouTube
    console.log('🔄 Fetching transcript from YouTube:', videoId);
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptData || transcriptData.length === 0) {
      return NextResponse.json(
        { error: 'No transcript available for this video. Make sure the video has captions enabled.' },
        { status: 404 }
      );
    }

    // Combine transcript segments
    const fullTranscript = transcriptData
      .map((segment: any) => segment.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Calculate approximate duration (offset is in milliseconds)
    const lastSegment = transcriptData[transcriptData.length - 1];
    const videoDuration = lastSegment?.offset ? Math.round((lastSegment.offset + (lastSegment.duration || 0)) / 1000) : 0;

    // Get video title (we'll use a simple approach for now)
    const videoTitle = `Video ${videoId}`;

    // Store in database for caching
    const { error: insertError } = await supabase
      .from('transcripts')
      .insert({
        youtube_video_id: videoId,
        transcript_text: fullTranscript,
        video_title: videoTitle,
        video_duration: videoDuration,
        video_url: youtubeUrl
      });

    if (insertError) {
      console.error('Error caching transcript:', insertError);
      // Continue anyway - we have the transcript
    } else {
      console.log('✅ Transcript cached successfully');
    }

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        transcript: fullTranscript,
        videoTitle,
        videoDuration,
        cached: false
      }
    });

  } catch (error: any) {
    console.error('YouTube transcript error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    if (error.message?.includes('Transcript is disabled') || error.message?.includes('Could not find captions')) {
      return NextResponse.json(
        { error: 'Transcript is disabled for this video or no captions available' },
        { status: 404 }
      );
    }

    if (error.message?.includes('Video unavailable')) {
      return NextResponse.json(
        { error: 'Video is unavailable or private' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch transcript: ${error.message}` },
      { status: 500 }
    );
  }
}
