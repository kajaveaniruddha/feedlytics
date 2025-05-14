"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Lightbulb, MessageSquare, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const workflowSteps = [
  {
    id: "collect",
    title: "Collect Feedback",
    description: "Gather user feedback through customizable forms, widgets, and integrations.",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "from-blue-500 to-indigo-600",
    image: "/workflow-1.svg",
  },
  {
    id: "analyze",
    title: "AI Analysis",
    description: "Our AI automatically categorizes, and extracts insights from feedback.",
    icon: <Lightbulb className="h-5 w-5" />,
    color: "from-amber-500 to-orange-600",
    image: "/workflow-2.png",
  },
  {
    id: "route",
    title: "Smart Routing",
    description: "Automatically notify the right teams based on feedback content and category.",
    icon: <Zap className="h-5 w-5" />,
    color: "from-emerald-500 to-green-600",
    image: "/workflow-3.png",
  }
]

export default function LandingPageWorkFlow() {
  const [activeStep, setActiveStep] = useState("collect")

  return (
    <section id="workflows" className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="px-4 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300 inline-flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              HOW IT WORKS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400"
          >
            Streamlined Feedback Workflow
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto"
          >
            Turn user feedback into actionable insights with our intelligent workflow
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-baseline">
          {/* Step selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative cursor-pointer group transition-all duration-300 ease-in-out ${
                  activeStep === step.id ? "scale-105 z-10" : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                }`}
              >
                <div
                  className={`
                    p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 
                    ${
                      activeStep === step.id
                        ? "bg-white dark:bg-neutral-800 shadow-lg"
                        : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      bg-gradient-to-br ${step.color} text-white shrink-0
                    `}
                    >
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
                            {index + 1}
                          </span>
                          {step.title}
                        </h3>

                        <ArrowRight
                          className={`
                          h-5 w-5 transition-transform duration-300
                          ${activeStep === step.id ? "translate-x-1 text-blue-500 dark:text-blue-400" : "text-neutral-400"}
                          ${activeStep !== step.id ? "opacity-0 group-hover:opacity-100" : ""}
                        `}
                        />
                      </div>

                      <p className="text-neutral-600 dark:text-neutral-400">{step.description}</p>
                    </div>
                  </div>
                </div>

                {/* Connection line */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-[2.25rem] top-[4.5rem] w-0.5 h-8 bg-gradient-to-b from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 z-0" />
                )}
              </div>
            ))}

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:scale-105 transition-all"
              >
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Visual representation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {workflowSteps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{
                  opacity: activeStep === step.id ? 1 : 0,
                  scale: activeStep === step.id ? 1 : 0.95,
                  y: activeStep === step.id ? 0 : 10,
                }}
                transition={{ duration: 0.4 }}
                className={`absolute inset-0 ${activeStep === step.id ? "z-10" : "z-0"}`}
              >
                <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-900">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="w-full"
                  />

                  {/* Overlay with gradient */}
                  {/* <div className={`absolute inset-0 bg-gradient-to-tr ${step.color} opacity-10`} /> */}

                  {/* Feature highlight */}
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${step.color} text-white`}
                      >
                        {step.icon}
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        
        </div>
      </div>
    </section>
  )
}
