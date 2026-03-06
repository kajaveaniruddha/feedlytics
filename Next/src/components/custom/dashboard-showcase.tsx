import React from 'react'
import Image from 'next/image'

type Props = {}

const DashboardShowcase = (props: Props) => {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                        Visualize Your Feedback
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful dashboard to track and analyze all your feedback in one place
                    </p>
                </div>
                <Image width={1200} height={600} src="/homepage.svg?height=600&width=1200" alt="Feedlytics Dashboard" className="w-full h-auto" loading="lazy" sizes="(max-width: 1200px) 100vw, 1200px" />
            </div>
        </section>
    )
}

export default DashboardShowcase