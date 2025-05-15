"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Shield, Database, Share2, Lock, User, Cookie } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { ReactNode } from "react"

export default function PrivacyPage() {
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
                            Privacy Policy
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
                    <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 mb-12">
                        Feedlytics values your privacy. This Privacy Policy outlines how we handle your information.
                    </p>

                    <div className="space-y-16">
                        <PrivacySection
                            icon={<Database className="w-6 h-6" />}
                            title="Data We Collect"
                            content={
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>User account data (email, name, avatar)</li>
                                    <li>Feedback collected via forms</li>
                                    <li>Technical logs (IP, browser info)</li>
                                    <li>Subscription and payment info (processed via - <a className="text-purple-600 dark:text-purple-400 hover:underline" href="https://stripe.com/in" target="_blank">Stripe</a>)</li>
                                </ul>
                            }
                        />

                        <PrivacySection
                            icon={<Shield className="w-6 h-6" />}
                            title="Use of Data"
                            content={
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>To provide and improve our services</li>
                                    <li>To categorize and analyze feedback</li>
                                    <li>To communicate with users about important updates</li>
                                    <li>To process payments and manage subscriptions</li>
                                </ul>
                            }
                        />

                        <PrivacySection
                            icon={<Share2 className="w-6 h-6" />}
                            title="Data Sharing"
                            content={
                                <>
                                    <p className="mb-2">We do not sell your data.</p>
                                    <p>
                                        We may share data with trusted services like <a className="text-purple-600 dark:text-purple-400 hover:underline" href="https://groq.com/" target="_blank">Groq</a> for analysis or <a className="text-purple-600 dark:text-purple-400 hover:underline" href="https://stripe.com/in" target="_blank">Stripe</a> for payment processing.
                                    </p>
                                </>
                            }
                        />

                        <PrivacySection
                            icon={<Lock className="w-6 h-6" />}
                            title="Security"
                            content={
                                <>
                                    <p className="mb-2">Data is stored securely using industry best practices.</p>
                                    <p>Access is limited to authorized personnel only.</p>
                                </>
                            }
                        />

                        <PrivacySection
                            icon={<User className="w-6 h-6" />}
                            title="Your Rights"
                            content={
                                <>
                                    <p className="mb-2">You may access, modify, or delete your data at any time.</p>
                                    <p>
                                        For data requests or concerns, contact us at{" "}
                                        <a
                                            href="mailto:aakajave@gmail.com"
                                            className="text-purple-600 dark:text-purple-400 hover:underline"
                                        >
                                            aakajave@gmail.com
                                        </a>
                                        .
                                    </p>
                                </>
                            }
                        />

                        <PrivacySection
                            icon={<Cookie className="w-6 h-6" />}
                            title="Cookies"
                            content={<p>We use cookies for authentication and improving user experience.</p>}
                        />
                    </div>

                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            By using Feedlytics, you consent to the practices described in this Privacy Policy. If you have any
                            questions, please contact us at{" "}
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

function PrivacySection({ icon, title, content }: { icon: ReactNode, title: string, content: ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{title}</h3>
            </div>
            <div className="pl-14 text-neutral-700 dark:text-neutral-300">{content}</div>
        </motion.div>
    )
}
