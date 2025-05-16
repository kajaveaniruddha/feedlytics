import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/custom/navbar";
import { MessageProvider } from "@/context/MessageProvider";
import Script from "next/script";
import { TanstackProvider } from "@/context/tanstack-provider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get all your feedbacks analysed with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en" suppressHydrationWarning>
      <AuthProvider>
        <section className={`flex`}>
          <MessageProvider>
            <Navbar />
            <div className="w-full mx-auto max-sm:w-[95%] sm:ml-64" style={{ scrollbarGutter: "stable" }}>
              <TanstackProvider>
                {children}
              </TanstackProvider>
            </div>
          </MessageProvider>
          <Toaster />
        </section>
      </AuthProvider>
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
    </main>
  );
}
