'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 19, yearly: 15 },
    description: 'Start producing faster and better content.',
    features: [
      '30 videos/month',
      'Ideas generator',
      'Multi-format export',
      'Scheduling & tags',
      'Email support',
    ],
    cta: 'Try it free',
    popular: false,
  },
  {
    name: 'Creator',
    price: { monthly: 39, yearly: 29 },
    description: 'Speed up your content strategy from A to Z.',
    features: [
      'Unlimited videos',
      'Content inspirations',
      'Analytics dashboard',
      'Priority support',
      'API access',
      'Team collaboration',
    ],
    cta: 'Try it free',
    popular: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    description: 'For businesses or agencies to amplify their content creation.',
    features: [
      'Unlimited videos',
      'Multi-account management',
      'Custom reports',
      'Dedicated manager',
      'Priority chat support',
      'White-label options',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { user } = useAuth();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to save time?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the offer that fits your content creation needs.
          </p>

          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly{' '}
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-1">
                30% off
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-purple-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  {typeof plan.price === 'object' ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-600 ml-2">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  )}
                </div>
              </div>

              {plan.cta === 'Contact Sales' ? (
                <Link href="#contact">
                  <button
                    className={`w-full py-3 rounded-full font-semibold mb-6 transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              ) : (
                <Link href={user ? '/dashboard' : '/signup'}>
                  <button
                    className={`w-full py-3 rounded-full font-semibold mb-6 transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {user ? 'Go to Dashboard →' : plan.cta}
                  </button>
                </Link>
              )}

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
