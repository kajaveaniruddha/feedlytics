import type { Metadata } from "next";
import { Inter,Questrial } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedlytics - %s",
  description: "Collect, Visualize & Analyze your Feedbacks with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#2c2c2c]`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="Dark"
          enableSystem
          disableTransitionOnChange
        > */}
          {children}
          <Analytics />
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
