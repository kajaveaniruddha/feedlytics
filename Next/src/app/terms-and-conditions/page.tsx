"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function TermsPage() {
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
                            Terms and Conditions
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Effective Date: May 16, 2024
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-6 rounded-full"></div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-16 mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-neutral-800 rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
                >
                    <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 mb-8">
                        Welcome to Feedlytics. By using our website, widgets, or any part of our service (the &quot;Service&quot;), you agree to the following Terms and Conditions:
                    </p>

                    <div className="space-y-8">
                        <TermsSection
                            number="1"
                            title="Use of Service"
                            content="You must be 13 years or older to use Feedlytics. By using our Service, you agree to comply with all applicable laws and regulations."
                        />

                        <TermsSection
                            number="2"
                            title="Accounts and Access"
                            content="You are responsible for maintaining the confidentiality of your account. You must notify us of any unauthorized use."
                        />

                        <TermsSection
                            number="3"
                            title="Subscription Plans"
                            content="We offer both free and premium plans. Premium subscriptions grant access to additional features. Payments are processed securely, and subscription terms will be stated at the time of purchase."
                        />

                        <TermsSection
                            number="4"
                            title="Cancellation and Refunds"
                            content="Users may cancel their premium subscription anytime. Refunds are not issued for partial months."
                        />

                        <TermsSection
                            number="5"
                            title="Acceptable Use"
                            content="You agree not to misuse the Service, upload malicious code, or abuse API rate limits."
                        />

                        <TermsSection
                            number="6"
                            title="Modifications"
                            content="We reserve the right to modify these Terms at any time. Continued use of the Service implies acceptance of updated Terms."
                        />
                    </div>

                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            If you have any questions about these Terms, please contact us at{" "}
                            <a href="mailto:aakajave@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                                aakajave@gmail.com
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}

function TermsSection({ number, title, content }: { number: string, title: string, content: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4"
        >
            <div className="flex-shrink-0 flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    {number}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">{title}</h3>
                <p className="text-neutral-700 dark:text-neutral-300">{content}</p>
            </div>
        </motion.div>
    )
}
