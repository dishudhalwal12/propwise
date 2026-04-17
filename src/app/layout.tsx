import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
