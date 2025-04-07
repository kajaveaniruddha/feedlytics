import type { Metadata } from "next";
import { Inter, Questrial } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';
import { ModeToggle } from "@/components/custom/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedlytics",
  description: "Collect, Visualize & Analyze your Feedbacks with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          // defaultTheme="Light"
          enableSystem
          disableTransitionOnChange
        >
          <ModeToggle />
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
