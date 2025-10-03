'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    icon: '⏰',
    text: 'I spend hours creating content.',
  },
  {
    icon: '💡',
    text: "I'm running out of content ideas.",
  },
  {
    icon: '📊',
    text: 'My posts barely get engagement.',
  },
  {
    icon: '📅',
    text: "I can't stay consistent.",
  },
  {
    icon: '🔧',
    text: "I'm juggling four different tools.",
  },
  {
    icon: '📈',
    text: "I don't understand my results.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tired of spending hours on content creation?
          </h2>
          <p className="text-xl text-gray-600">
            Repurposly brings your ideas to life in just a few clicks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-3">{problem.icon}</div>
              <p className="text-gray-700 font-medium">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-100 to-blue-50 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl">
                ✨
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                There&apos;s just one solution: <span className="text-purple-600">Repurposly</span>
              </h3>
              <p className="text-gray-700 mb-4">
                I stopped using multiple tools to <strong>create social content</strong>. I spent 100+ hours
                learning different platforms and juggling various workflows. But I just wanted to click ONE
                button and get it done.
              </p>
              <p className="text-gray-700">
                That&apos;s when <strong>Repurposly changed everything</strong>.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-purple-200">
            <p className="text-sm text-gray-600">— Content Creators Worldwide</p>
            <p className="text-sm text-gray-500">10,000+ satisfied users</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
