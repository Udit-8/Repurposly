'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Creator',
    content:
      'Been really enjoying Repurposly - especially the video-to-content tool & how it converts YouTube content into written text. So easy to use as well.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Digital Marketer',
    content:
      'Benefits of Using Repurposly: ✔️ Find unlimited content ideas ✔️ Saves you time and effort ✔️ Generate engaging content ✔️ Grow your social presence',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    role: 'Social Media Manager',
    content:
      "I wasn't convinced by AI until I discovered Repurposly. The tool is very well made, very practical and ergonomic, and it's the perfect assistant for content creation.",
    rating: 5,
  },
  {
    name: 'David Martinez',
    role: 'YouTube Creator',
    content:
      'Very impressed by the Repurposly tool! The first time I see something really useful for repurposing content of such quality. Well done!',
    rating: 5,
  },
  {
    name: 'Lisa Anderson',
    role: 'Entrepreneur',
    content:
      'This application is simply INCREDIBLE! High-quality time-saving with excellent results. Thank you for making this possible!',
    rating: 5,
  },
  {
    name: 'James Taylor',
    role: 'Marketing Manager',
    content:
      'Repurposly has been a game-changer for my content strategy. It streamlines content creation, saving me valuable time while ensuring my posts are impactful.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Already 10,000+ Repurposly fans</h2>
          <p className="text-xl text-gray-600">Find out what they think of our solution.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.content}</p>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
          >
            Read more reviews →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
