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
            "Yes, data privacy and compliance are top priorities. Feedlytics uses TLS encryption, follows GDPR guidelines, and securely stores data with proper retention policies. Your users&apos; data is never shared or sold.",
    },
    {
        question: "What is the pricing model? Are there any hidden fees?",
        answer:
            "Feedlytics offers three transparent plans:\n\n**Free** — 200 feedbacks/month, 3 workflows, 1 team member. Perfect for indie hackers and early-stage products.\n\n**Pro ($19/month)** — 2,000 feedbacks/month, 15 workflows, 5 team members, CSV export, feedback replies, and webhook integrations.\n\n**Business ($79/month)** — 20,000 feedbacks/month, unlimited workflows, 25 team members, API access, and white-label (remove Feedlytics branding).\n\nAll plans include full AI-powered sentiment analysis and categorization. Annual billing saves you 2 months. Usage resets monthly.",
    },
    {
        question: "Do you offer a free trial or demo?",
        answer:
            "Yes! You can sign up for a free trial with full access to premium features for a limited time. Live product demos are also available upon request for teams that want a guided walkthrough.",
    },
    {
        question: "How quickly can I start seeing actionable insights?",
        answer:
            "Setup takes just 30 seconds for forms and upto 60 seconds with our simple widget integration. Once installed, you&apos;ll start receiving categorized and sentiment-tagged feedback in real-time. Alerts and dashboards update instantly so you can act fast.",
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
                    className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                        <div className="flex-shrink-0">
                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                </button>

                {isOpen && (
                    <div className="px-6 pb-6">
                        <div className="pt-2 border-t border-border">
                            <div className="mt-4 leading-relaxed text-muted-foreground">
                                {item.answer.split("\n\n").map((paragraph, index) => {
                                    if (paragraph.startsWith("```html") && paragraph.endsWith("```")) {
                                        const codeContent = paragraph.slice(7, -3).trim()
                                        return (
                                            <div key={index} className="my-4">
                                                <div className="bg-secondary rounded-lg p-4 overflow-x-auto border border-border">
                                                    <pre className="text-sm text-foreground">
                                                        <code>{codeContent}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        )
                                    }
                                    const parts = paragraph.split(/\*\*(.+?)\*\*/g)
                                    return (
                                        <p key={index} className="mb-4 last:mb-0">
                                            {parts.map((part, i) =>
                                                i % 2 === 1 ? (
                                                    <strong key={i} className="font-semibold text-foreground">{part}</strong>
                                                ) : (
                                                    <span key={i}>{part}</span>
                                                )
                                            )}
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
        <section className="py-16 bg-background" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold sm:text-4xl mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about Feedlytics. Can&apos;t find the answer you&apos;re looking for?
                        <a href="mailto:aakajave@gmail.com" className="text-primary hover:text-primary/80 ml-1">
                            Contact our support team
                        </a>
                        .
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={expandAll}
                        className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary rounded-lg hover:bg-accent transition-colors"
                    >
                        Collapse All
                    </button>
                </div>

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
