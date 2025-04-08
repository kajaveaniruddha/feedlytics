import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/custom/navbar";
import { MessageProvider } from "@/context/MessageProvider";

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
          <Navbar />
          <MessageProvider>
            <div className="w-full mx-auto max-sm:w-[95%] sm:ml-64" style={{ scrollbarGutter: "stable" }}>
              {children}
            </div>
          </MessageProvider>
          <Toaster />
        </section>
      </AuthProvider>
    </main>
  );
}
