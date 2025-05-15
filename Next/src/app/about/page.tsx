"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <BackgroundBeams className="opacity-20" />
        <div className="relative z-10 px-4 py-24 mx-auto max-w-5xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
              About Us
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-16 mx-auto max-w-3xl">
        <div className="grid gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Our Mission</h2>
            
            <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 mb-6">
              <span className="font-bold text-purple-600 dark:text-purple-400">Feedlytics</span> is built for SaaS teams who care about listening to their users. We provide a seamless way to collect real-time feedback through embeddable forms and chat widgets, transforming raw user input into categorized, actionable insights using AI.
            </p>
            
            <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              With integrations into tools like Slack, Google Chat, and Microsoft Teams, teams can instantly act on what matters—bugs, suggestions, questions, and more.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Our Vision</h2>
            
            <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              We believe in empowering product teams with the clarity to build better. Our mission is simple: close the loop between your users and your team in the fastest and smartest way possible.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Ready to transform your feedback process?</h2>
              
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:scale-105 transition-all"
              >
                Get Started Free
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
