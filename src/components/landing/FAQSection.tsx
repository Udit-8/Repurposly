'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: 'How does Repurposly work?',
    answer:
      'Simply paste a YouTube video URL, and our AI will analyze the content and generate multiple pieces of content optimized for different platforms including Twitter, LinkedIn, blog posts, and more.',
  },
  {
    question: 'What platforms does Repurposly support?',
    answer:
      'Repurposly currently supports Twitter, LinkedIn, Instagram, Facebook, and blog content. We\'re constantly adding support for more platforms based on user feedback.',
  },
  {
    question: 'Can I customize the generated content?',
    answer:
      'Absolutely! All generated content is fully editable. You can customize the tone, style, length, and format to match your brand voice before publishing.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! We offer a 7-day free trial with access to all Starter plan features. No credit card required to start.',
  },
  {
    question: 'How many videos can I repurpose per month?',
    answer:
      'It depends on your plan. The Starter plan allows 30 videos per month, while the Creator plan offers unlimited video repurposing.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term commitments.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee. If you\'re not satisfied with Repurposly within the first 30 days, we\'ll provide a full refund.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take data security seriously. All data is encrypted in transit and at rest. We never share your content or data with third parties.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <p className="text-gray-600">
            Can&apos;t find the answer to your question?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
              Contact us
            </a>
            .
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
