'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface TweetCardProps {
  content: string;
  index: number;
  onCopy?: (text: string) => void;
}

export default function TweetCard({ content, index, onCopy }: TweetCardProps) {
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
    const words = text.split(/(\s+)/);

    return words.map((word, wordIdx) => {
      // Keep whitespace
      if (word.match(/^\s+$/)) {
        return <span key={wordIdx}>{word}</span>;
      }

      // Style hashtags
      if (word.startsWith('#')) {
        return (
          <span key={wordIdx} className="text-[#1d9bf0] font-normal hover:underline">
            {word}
          </span>
        );
      }

      return <span key={wordIdx}>{word}</span>;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            Y
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[14px] text-gray-900">Your Name</span>
              <svg className="w-3.5 h-3.5 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
              </svg>
            </div>
            <div className="text-[13px] text-gray-500">@yourhandle · now</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-xs h-7 px-2"
        >
          {copied ? '✓' : '📋'}
        </Button>
      </div>

      {/* Content */}
      <div className="text-[14px] text-gray-900 leading-normal mb-3 whitespace-pre-wrap">
        {formatContent(content)}
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-4 text-gray-500 text-[13px] pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 hover:text-pink-600 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
