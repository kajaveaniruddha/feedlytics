import React from 'react'

const features = [
  {
    title: "Collect Feedbacks",
    description: "Integrate with guaranteed developer-friendly APIs to collect feedbacks.",
    svg: (
      <svg
        className="w-5 h-5 text-[hsl(var(--brand-green))]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Visualize Feedbacks",
    description: "Turn your collected feedback into insightful visual data with our beautiful charts.",
    svg: (
      <svg
        className="w-5 h-5 text-[hsl(var(--brand-green))]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4-10V7a4 4 0 00-8 0v4m0 0H5m7 0h4"
        />
      </svg>
    ),
  },
  {
    title: "Analyze with AI",
    description: "Leverage artificial intelligence to gain deeper insights from your feedback data.",
    svg: (
      <svg
        className="w-5 h-5 text-[hsl(var(--brand-green))]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
        />
      </svg>
    ),
  },
]

const DetailsSignup = () => {
  return (
    <div className="hidden lg:flex flex-col mt-10 gap-8 w-1/2 p-12 z-10">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[hsl(var(--brand-green))] rounded-full" />
        <h1 className="text-2xl text-primary-foreground font-extralight">FEEDLYTICS</h1>
      </div>
      <div className="mb-8">
        <h2 className="text-4xl font-semibold text-primary-foreground mb-2">
          Start your free trial
        </h2>
        <p className="text-[hsl(var(--form-placeholder))]">No credit card required</p>
      </div>
      <div className="space-y-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col gap-4 items-start">
            <div className="p-2 rounded-full bg-[hsla(var(--card),0.1)]">
              {feature.svg}
            </div>
            <div>
              <h3 className=" font-medium text-2xl">
                {feature.title}
              </h3>
              <p className="text-[hsl(var(--form-placeholder))]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetailsSignup
