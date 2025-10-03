'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Turn YouTube videos into multi-platform content',
    description:
      'Share the URL of your favorite YouTube video. Repurposly will extract the content and repurpose it into tweets, LinkedIn posts, blog articles, and more.',
    icon: '🎥',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'AI-powered content generation',
    description:
      'Write standout posts with our AI powered by the most advanced generative models trained specifically for content repurposing.',
    icon: '🤖',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Multiple content formats',
    description:
      'Our AI allows you to create various content types: tweets, LinkedIn posts, blog articles, and Instagram captions. This way, it covers all your needs.',
    icon: '📝',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Generate ideas in seconds',
    description:
      'No more time lost brainstorming content ideas. Repurposly will bring content ideas to life in seconds based on your video.',
    icon: '💡',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Schedule and publish',
    description:
      'Go live anytime with safe, authenticated connections. Schedule your posts for later or publish them right away across all platforms.',
    icon: '📅',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Analytics and insights',
    description:
      'With Repurposly you can access all your content metrics in one place. Track performance with advanced information and analysis.',
    icon: '📊',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Content that captures your voice and scales with your ambition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Repurposly is not only your favorite content repurposing tool. It is the all-in-one platform
            for effortlessly creating engaging content across all platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Try Repurposly →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
