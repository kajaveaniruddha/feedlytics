import Link from "next/link"
import { LampContainer } from "@/components/ui/lamp"
import { MessageSquare, BarChart3, Bell, Workflow, LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react"
import Footer from "@/components/custom/footer"
import DashboardShowcase from "@/components/custom/dashboard-showcase"
import MotionDiv from "@/components/ui/motion-div"
import { AuroraBackground } from "@/components/ui/aurora-background"

export async function generateStaticParams() {
  return [{}];
}

export default function LandingPage() {
  return (
    <main >
      {/* Hero Section */}
      <AuroraBackground>
        <section className="relative w-full min-h-screen">
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 text-center">
            <MotionDiv
              className="flex flex-col gap-6 items-center max-w-4xl"
            >
              <div className="mb-2 px-4 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                FEEDLYTICS
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 pb-2">
                The Fastest Way to Understand Your Users
              </h1>

              <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl">
                Collect, analyze, and route user feedback in real-time with AI-powered insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:scale-105 transition-all flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-3 rounded-full bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  See Demo
                </Link>
              </div>
            </MotionDiv>
          </div>
        </section>
      </AuroraBackground>
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  clients?: string[];
}

function FeatureCard({ icon, title, description, clients = [] }: FeatureCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>

      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>

      <div className="relative p-8 z-10">
        {/* Icon with gradient background */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 shadow-md w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="text-purple-500 dark:text-purple-400">{icon}</div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 dark:text-neutral-300">
          {title}
        </h3>
        <p className="text-neutral-600 dark:group-hover:text-neutral-300 transition-colors mb-5 leading-relaxed">{description}</p>

        {clients.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 font-medium">Trusted by:</p>
            <div className="flex flex-wrap gap-2">
              {clients.map((client, index) => (
                <span
                  key={index}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-3xl"></div>
      </div>
    </div>
  )
}