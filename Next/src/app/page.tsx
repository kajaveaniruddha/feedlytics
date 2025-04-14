"use client"
import Link from "next/link"
import { LampContainer } from "@/components/ui/lamp"
import { MessageSquare, BarChart3, Bell, Workflow, LayoutDashboard, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import Footer from "@/components/custom/footer"
import DashboardShowcase from "@/components/custom/dashboard-showcase"
import MotionDiv from "@/components/ui/motion-div"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "framer-motion"
import FeatureCard from "@/components/custom/feature-card"
import Image from "next/image"
import LandingPageWorkFlow from "@/components/custom/landingpage-workflow"


export default function LandingPage() {
  return (
    <main >
      {/* Hero Section */}
      <AuroraBackground>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="flex flex-col gap-6 text-center lg:text-left"
            >
              <div className="mb-2 px-4 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 w-fit mx-auto lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                FEEDLYTICS
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
                AI-Powered Feedback Intelligence Platform for SaaS Teams
              </h1>

              <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300">
                Collect, analyze, and route user feedback in real-time with AI-powered insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 mx-auto lg:mx-0">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:scale-105 transition-all flex items-center gap-2 justify-center"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#workflows"
                  className="px-6 py-3 rounded-full bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  See Demo
                </Link>
              </div>
            </motion.div>

            {/* App Preview/Screenshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm">
                <Image
                  width={400}
                  height={300}
                  src="/DemoGif.gif"
                  alt="Feedlytics Dashboard"
                  className="w-full sm:w-2/3 h-auto"
                  priority
                />
                <div className=" flex flex-col gap-10 absolute top-6 right-3">
                  <div className="text-secondary-foreground bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700 max-sm:hidden">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium">AI-Powered Analysis</span>
                    </div>
                  </div>

                  <div className="text-secondary-foreground bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700 max-sm:hidden">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">Real-time Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>

      <LandingPageWorkFlow />

      {/* Features Overview */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FAFAFA] dark:from-[#18181B] to-neutral-50 dark:to-neutral-900 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
              Powerful Features
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
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

      {/* Dashboard Showcase */}
      <DashboardShowcase />
      {/* Final CTA */}
      <section className="relative">
        <LampContainer>
          <MotionDiv
            className="mt-8 mb-20 max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">Ready to Enhance Your Feedback Process?</h2>
            <p className="text-lg md:text-xl  text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using Feedlytics to improve their products
            </p>
            <Link
              href="/login"
              className="px-8 py-4 rounded-full bg-white text-black font-medium text-lg hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </MotionDiv>
        </LampContainer>
      </section>
      <Footer />
    </main >
  )
}

