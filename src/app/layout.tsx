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
  description: "Real Estate Intelligence Platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
