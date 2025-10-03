'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TwitterPreview from '@/components/SocialMediaPreviews/TwitterPreview';
import LinkedInPreview from '@/components/SocialMediaPreviews/LinkedInPreview';
import TweetCard from '@/components/SocialMediaPreviews/TweetCard';

export default function Dashboard() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleGenerate = async () => {
    if (!youtubeUrl) return;

    setLoading(true);
    setGeneratedContent(null);

    try {
      // Step 1: Get transcript
      const transcriptRes = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl })
      });

      if (!transcriptRes.ok) {
        const error = await transcriptRes.json();
        throw new Error(error.error || 'Failed to fetch transcript');
      }

      const transcriptData = await transcriptRes.json();
      console.log('✅ Transcript fetched:', transcriptData.data.cached ? 'from cache' : 'from YouTube');

      // Step 2: Generate content with Claude
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptData.data.transcript,
          videoId: transcriptData.data.videoId
        })
      });

      if (!generateRes.ok) {
        const error = await generateRes.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const generatedData = await generateRes.json();
      console.log('✅ Content generated successfully');

      setGeneratedContent({
        twitterThread: generatedData.data.twitter_thread,
        tweets: generatedData.data.tweets,
        linkedinPost: generatedData.data.linkedin_post
      });

    } catch (error: any) {
      console.error('Generation error:', error);
      alert(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback (you can add a toast here later)
      console.log('✅ Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Repurposly
            </h1>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate Content from YouTube</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Paste YouTube URL here..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                }
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!youtubeUrl || loading}
              className="sm:w-auto"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
        </Card>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-8">
            {/* Twitter Thread */}
            <div>
              <TwitterPreview
                content={generatedContent.twitterThread}
                onCopy={handleCopy}
              />
            </div>

            {/* Standalone Tweets */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <h3 className="font-semibold text-gray-900">Standalone Tweets</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(generatedContent.tweets.join('\n\n'))}
                  >
                    📋 Copy All
                  </Button>
                </div>
                <div className="p-4 grid gap-4">
                  {generatedContent.tweets.map((tweet: string, idx: number) => (
                    <TweetCard
                      key={idx}
                      content={tweet}
                      index={idx}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* LinkedIn Post */}
            <div>
              <LinkedInPreview
                content={generatedContent.linkedinPost}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!generatedContent && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to Transform Your Content?
            </h3>
            <p className="text-gray-500">
              Paste a YouTube URL above to get started
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Generating Your Content...
            </h3>
            <p className="text-gray-500">
              This may take a few seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
