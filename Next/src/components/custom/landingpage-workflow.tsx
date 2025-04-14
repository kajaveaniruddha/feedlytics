"use client"

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const LandingPageWorkFlow = () => {
    return (
        <section id="workflows" className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 pb-2">
                        How Feedlytics Works
                    </h2>
                    <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
                        A simple workflow to transform your feedback process
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block"></div>

                    {/* Step 1 */}
                    <WorkflowStep
                        number="1"
                        title="Collect Feedback"
                        description="Embed customizable forms or a chat widget directly into your app to gather user feedback seamlessly."
                        imageSrc="/workflow-1.svg"
                        imageAlt="Feedback Collection Interface"
                        direction="right"
                    />

                    {/* Step 2 */}
                    <WorkflowStep
                        number="2"
                        title="AI Analysis"
                        description="Our AI automatically categorizes feedback, detects sentiment, and extracts actionable insights."
                        imageSrc="/workflow-2.svg"
                        imageAlt="AI Analysis Dashboard"
                        direction="left"
                    />

                    {/* Step 3 */}
                    <WorkflowStep
                        number="3"
                        title="Smart Routing"
                        description="Feedback is automatically routed to the right teams via Slack, Google Chat, or custom webhooks."
                        imageSrc="/workflow-3.svg"
                        imageAlt="Smart Routing Interface"
                        direction="right"
                    />

                </div>
            </div>
        </section>
    )
}

export default LandingPageWorkFlow;

type Props = {
    number: string,
    title: string,
    description: string,
    imageSrc: string,
    imageAlt: string,
    direction: string
}

function WorkflowStep({ number, title, description, imageSrc, imageAlt, direction }: Props) {
    const isRight = direction === "right"

    return (
        <div className="mb-24 last:mb-0 w-[90%] mx-auto">
            <div className={`flex flex-col ${isRight ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}>
                {/* Step Number */}
                <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xl mb-4">
                    {number}
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex-1"
                >
                    <div className="relative">
                        {/* Step Number (Desktop) */}
                        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-2xl z-10">
                            {number}
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">{title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-300 mb-6">{description}</p>

                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                                <span>Learn more</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex-1"
                >
                    <div className="rounded-xl overflow-hidden">
                        <Image width={100} height={100} src={imageSrc} alt={imageAlt} className="w-full h-auto" priority />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}