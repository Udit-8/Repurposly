import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />

      {/* Placeholder for other sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            More sections coming soon...
          </h2>
          <p className="text-gray-600">
            Features, Pricing, Testimonials, and FAQ sections will be added next.
          </p>
        </div>
      </section>
    </div>
  );
}
