import Link from 'next/link';
import Button from './ui/Button';
import Badge from './ui/Badge';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex mb-6">
              <Badge variant="primary">
                🎯 AI-Powered Content Repurposing
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                YouTube Videos
              </span>
              <br />
              Into Viral Social Content
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Turn one video into 10+ pieces of content in minutes. Save hours of work and grow your audience across Twitter and LinkedIn.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/signup">
                <Button size="lg">
                  Try Free - No Credit Card
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="secondary" size="lg">
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                </div>
                <span>1,000+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span className="font-semibold">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Screenshot */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              {/* Mock Screenshot */}
              <div className="space-y-4">
                {/* URL Input mockup */}
                <div className="border-2 border-primary rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    📹 YouTube URL
                  </div>
                  <div className="bg-gray-100 rounded px-3 py-2 text-gray-600">
                    https://youtube.com/watch?v=...
                  </div>
                </div>

                {/* Generated content preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 mb-1">Twitter Thread</div>
                    <div className="text-xs text-blue-600">8 tweets ready ✨</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 mb-1">LinkedIn Post</div>
                    <div className="text-xs text-purple-600">2 posts ready ✨</div>
                  </div>
                </div>

                {/* Action buttons mockup */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-primary text-white rounded-lg py-2 text-center text-sm font-medium">
                    Copy All
                  </div>
                  <div className="px-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📋</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                10x faster ⚡
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-200">
                AI Powered 🤖
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
