"use client"
import Link from "next/link"
import { MessageSquare, BarChart3, Bell, Workflow, LayoutDashboard, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import Footer from "@/components/layout/footer"
import DashboardShowcase from "@/app/(marketing)/_components/dashboard-showcase"
import MotionDiv from "@/components/ui/motion-div"
import { AuroraBackground } from "@/app/(marketing)/_components/aurora-background"
import { motion } from "framer-motion"
import FeatureCard from "@/app/(marketing)/_components/feature-card"

import LandingPageWorkFlow from "@/app/(marketing)/_components/landing-workflow"
import Script from "next/script"
import FaqSection from "@/app/(marketing)/_components/faq-section"


export default function LandingPage() {
  return (
    <>
      <main >
        {/* Hero Section */}
        <AuroraBackground>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="container mx-auto items-center justify-center flex flex-col gap-6 text-center"
              >
                <div className="mb-2 px-4 py-1.5 border border-border rounded-full text-sm font-medium text-muted-foreground flex items-center gap-1.5 w-fit mx-auto lg:mx-0">
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                  FEEDLYTICS
                </div>

                <h1 className="text-5xl md:text-7xl py-4 font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                  AI-Powered Feedback <br />Intelligence Platform for SaaS Teams
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground">
                  Collect, analyze, and route user feedback in real-time with AI-powered insights.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-6 mx-auto lg:mx-0">
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 hover:brightness-110 transition-all flex items-center gap-2 justify-center shadow-md"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#workflows"
                    className="px-6 py-3 rounded-full bg-transparent border border-border text-foreground font-medium hover:bg-accent transition-all"
                  >
                    See Demo
                  </Link>
                </div>
              </motion.div>
            </div>
        </AuroraBackground>

        <LandingPageWorkFlow />

        {/* Features Overview */}
        <section className="py-24 px-4 bg-gradient-to-b from-secondary to-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                Powerful Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to collect, analyze, and act on user feedback
              </p>
            </div>

            <MotionDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="Easy Feedback Collection"
                description="Embed customizable forms or a chat widget directly into your app."
              // clients={["Nuoptima", "Rock The Rankings", "Plerdy"]}
              />

              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="AI-Powered Analysis"
                description="Utilize Groq AI to automatically detect sentiment and categorize feedback."
              />

              <FeatureCard
                icon={<Bell className="h-6 w-6" />}
                title="Smart Routing"
                description="Automatically notify the right teams via Slack, Google Chat, or custom webhooks based on feedback categories."
              />

              <FeatureCard
                icon={<Workflow className="h-6 w-6" />}
                title="Workflow Automation"
                description="Create, manage, and customize workflows to handle feedback efficiently."
              />

              <FeatureCard
                icon={<LayoutDashboard className="h-6 w-6" />}
                title="Comprehensive Dashboard"
                description="View, sort, and search all feedback with detailed insights and filters."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Secure Authentication"
                description="Support for Google and GitHub authentication for seamless user access."
              />
            </MotionDiv>
          </div>
        </section>
        <DashboardShowcase />
        <FaqSection/>
        <Footer />
      </main >
      <Script id="feedlytics-widget-init" strategy="afterInteractive">
        {`
              window.feedlytics_widget = {
                username: "github_kajaveaniruddha"
              };
            `}
      </Script>
      <Script
        src="https://widget.feedlytics.in/feedlytics_widget.js"
        strategy="afterInteractive"
      />
    </>
  )
}

