import type { Metadata } from "next";
import { Inter, Roboto, Lato, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/custom/mode-toggle";
import { ReactLenis } from "@/lib/lenis";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL("https://feedlytics.in"),
  title: 'Feedlytics – Instant Feedback Analytics for SaaS Teams',
  description:
    'Collect, analyze, and route user feedback in real-time using AI-powered sentiment and category detection. Automate team notifications via Slack, Google Chat, and more.',
  keywords: [
    'SaaS feedback tool',
    'real-time feedback analysis',
    'AI sentiment analysis',
    'feedback automation',
    'user feedback system',
    'Slack feedback integration',
    'Groq LLM sentiment',
    'feedback categorization',
    'in-app feedback widget',
    'feedback forms',
  ],
  openGraph: {
    title: 'Feedlytics – Real-Time Feedback Intelligence for SaaS Teams',
    description:
      'Collect, analyze, and route user feedback in real-time using AI-powered sentiment and category detection. Automate team notifications via Slack, Google Chat, and more.',
    url: 'https://feedlytics.in',
    type: 'website',
    images: [
      {
        url: 'https://feedlytics.in/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Feedlytics Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@feedlytics',
    title: 'Feedlytics – Real-Time Feedback Intelligence for SaaS Teams',
    description:
      'Collect, analyze, and route user feedback in real-time using AI-powered sentiment and category detection. Automate team notifications via Slack, Google Chat, and more.',
    images: ['https://feedlytics.in/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactLenis root>
        <body className={`${roboto.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            // defaultTheme="Light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ModeToggle />
            <Toaster />
          </ThemeProvider>
        </body>
      </ReactLenis>
    </html>
  );
}
