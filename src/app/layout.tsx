import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { PropertyChatbot } from "@/components/chat/property-chatbot";
import { AuthProvider } from "@/components/providers/auth-provider";

import "./globals.css";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "PropWise",
  description: "Real Estate Intelligence Platform",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <PropertyChatbot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
