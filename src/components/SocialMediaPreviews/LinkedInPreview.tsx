'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface LinkedInPreviewProps {
  content: string;
  onCopy?: (text: string) => void;
}

export default function LinkedInPreview({ content, onCopy }: LinkedInPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(content);
    } else {
      await navigator.clipboard.writeText(content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (text: string) => {
    // Remove all ** symbols from the text first
    const cleanedText = text.replace(/\*\*/g, '');
    const lines = cleanedText.split('\n');

    return lines.map((line, idx) => {
      const trimmedLine = line.trim();

      // Skip empty lines but add spacing
      if (!trimmedLine) {
        return <div key={idx} className="h-3" />;
      }

      // Skip separator lines
      if (trimmedLine === '---') {
        return <div key={idx} className="border-t border-gray-200 my-3" />;
      }

      // Process words for hashtag styling
      const words = trimmedLine.split(/(\s+)/);

      return (
        <p key={idx} className="mb-0 leading-[1.5] text-[14px] text-gray-900">
          {words.map((word, wordIdx) => {
            // Keep whitespace
            if (word.match(/^\s+$/)) {
              return <span key={wordIdx}>{word}</span>;
            }

            // Style hashtags
            if (word.startsWith('#')) {
              return (
                <span key={wordIdx} className="text-[#0a66c2] font-medium hover:underline">
                  {word}
                </span>
              );
            }

            return <span key={wordIdx}>{word}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <h3 className="font-semibold text-gray-900">LinkedIn Post</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-sm"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </Button>
      </div>

      {/* LinkedIn Card */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* User Info */}
          <div className="flex items-start gap-3 p-4 pb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-lg">
              Y
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-gray-900">Your Name</div>
              <div className="text-[12px] text-gray-600">Your Professional Title</div>
              <div className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                <span>Now</span>
                <span>•</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM3 8a5 5 0 0 1 5-5v5H3z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            {formatContent(content)}
          </div>

          {/* Engagement Bar */}
          <div className="border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 text-[12px] text-gray-500">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center border border-white">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.5 1.5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L3 5l3.5-.5z"/>
                    </svg>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center border border-white">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8zm6-5a5 5 0 0 0-3.61 8.45L8 8l3.61 3.45A5 5 0 0 0 8 3z"/>
                    </svg>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-white">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around border-t border-gray-200 py-2 px-4">
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="text-[14px] font-medium">Like</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-[14px] font-medium">Comment</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-[14px] font-medium">Repost</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-[14px] font-medium">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
