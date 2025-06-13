"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FAQItem {
    question: string
    answer: string
}

const faqData: FAQItem[] = [
    {
        question: "What is Feedlytics and how does it work?",
        answer:
            "Feedlytics is a real-time feedback analytics tool that helps teams collect, analyze, and act on user feedback effortlessly. It uses powerful AI models to detect sentiment (positive/negative) and categorize feedback (bug, suggestion, complaint, etc.). With smart notifications through Slack, Google Chat, or webhooks, your team is always instantly informed about critical insights—without manual sorting.",
    },
    {
        question: "Can I collect in-app feedback without coding?",
        answer:
            'Yes, absolutely! Feedlytics offers a plug-and-play feedback widget that you can embed into any web app in seconds using a simple script:\n\n```html\n<script>\n  window.feedlytics_widget = {\n    username: "your_username"\n  };\n</script>\n<script defer src="https://widget.feedlytics.in/feedlytics_widget.js"></script>\n```\n\nJust paste this into your HTML and you\'re done—no coding or backend integration required. The widget is fully customizable to match your brand and feedback flow.'
    },
    {
        question: "What types of feedback does Feedlytics support?",
        answer:
            "Feedlytics supports various forms of feedback including in-app surveys, custom forms, bug reports, feature requests, and general suggestions. You can optionally collect user names and email addresses to better understand user context.",
    },
    {
        question: "How does AI sentiment and category detection improve feedback?",
        answer:
            "Feedlytics uses advanced LLMs (via Groq) to automatically analyze feedback content and determine sentiment and intent. It categorizes responses into actionable types (bug, request, praise, etc.), enabling product and support teams to prioritize the most impactful feedback without manual review.",
    },
    {
        question: "Which notification channels are supported?",
        answer:
            "Feedlytics integrates seamlessly with Slack, Google Chat, email, and custom webhooks. You can configure real-time alerts based on feedback category type, ensuring the right team gets notified instantly.",
    },
    {
        question: "Is user data secure and compliant?",
        answer:
            "Yes, data privacy and compliance are top priorities. Feedlytics uses TLS encryption, follows GDPR guidelines, and securely stores data with proper retention policies. Your users' data is never shared or sold.",
    },
    {
        question: "What's the pricing model? Are there any hidden fees?",
        answer:
            "Feedlytics offers two simple and transparent plans: Free and Premium. The Free plan includes up to 50 total feedbacks and 10 workflows, ideal for early-stage users. The Premium plan - paid once per account, allows 100 total feedbacks and 20 workflows, perfect for growing teams. There are no hidden fees, and you can not cancel once upgraded!",
    },
    {
        question: "Do you offer a free trial or demo?",
        answer:
            "Yes! You can sign up for a free trial with full access to premium features for a limited time. Live product demos are also available upon request for teams that want a guided walkthrough.",
    },
    {
        question: "How quickly can I start seeing actionable insights?",
        answer:
            "Setup takes just 30 seconds for forms and upto 60 seconds with our simple widget integration. Once installed, you'll start receiving categorized and sentiment-tagged feedback in real-time. Alerts and dashboards update instantly so you can act fast.",
    },
    {
        question: "Which tools and platforms does Feedlytics integrate with?",
        answer:
            "Feedlytics currently integrates with Slack, Google Chat, email, webhooks, and Stripe (for billing). Support for platforms like Microsoft Teams, Notion, and Linear is coming soon.",
    },
]

interface FAQItemProps {
    item: FAQItem
    isOpen: boolean
    onToggle: () => void
}

function FAQItemComponent({ item, isOpen, onToggle }: FAQItemProps) {
    return (
        <Card className="mb-4 transition-all duration-200 hover:shadow-md">
            <CardContent className="p-0">
                <button
                    className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                        <div className="flex-shrink-0">
                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                        </div>
                    </div>
                </button>

                {isOpen && (
                    <div className="px-6 pb-6">
                        <div className="pt-2 border-t border-gray-100">
                            <div className="mt-4 leading-relaxed">
                                {item.answer.split("\n\n").map((paragraph, index) => {
                                    if (paragraph.startsWith("```html") && paragraph.endsWith("```")) {
                                        // Extract code content
                                        const codeContent = paragraph.slice(7, -3).trim()
                                        return (
                                            <div key={index} className="my-4">
                                                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                                    <pre className="text-sm text-gray-100">
                                                        <code>{codeContent}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <p key={index} className="mb-4 last:mb-0">
                                            {paragraph}
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function FaqSection() {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set())

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index)
        } else {
            newOpenItems.add(index)
        }
        setOpenItems(newOpenItems)
    }

    const expandAll = () => {
        setOpenItems(new Set(faqData.map((_, index) => index)))
    }

    const collapseAll = () => {
        setOpenItems(new Set())
    }

    return (
        <section className="py-16 light:bg-gray-50" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about Feedlytics. Can't find the answer you're looking for?
                        <a href="mailto:aakajave@gmail.com" className="text-blue-600 hover:text-blue-800 ml-1">
                            Contact our support team
                        </a>
                        .
                    </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={expandAll}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Collapse All
                    </button>
                </div>

                {/* FAQ Items */}
                <div className="space-y-2">
                    {faqData.map((item, index) => (
                        <FAQItemComponent
                            key={index}
                            item={item}
                            isOpen={openItems.has(index)}
                            onToggle={() => toggleItem(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
