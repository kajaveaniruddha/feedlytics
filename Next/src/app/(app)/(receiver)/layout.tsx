import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/custom/navbar";
import { MessageProvider } from "../../../context/MessageProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en">
      <AuthProvider>
        <section className={`flex bg-[#fffcfc]`}>
          <Navbar />
          <MessageProvider>
            <div className="w-full  mx-auto max-sm:w-[95%] sm:ml-52" style={{ scrollbarGutter: "stable" }}>
              {children}
            </div>
          </MessageProvider>
          <Toaster />
        </section>
      </AuthProvider>
    </main>
  );
}
