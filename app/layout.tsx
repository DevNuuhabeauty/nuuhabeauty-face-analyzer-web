import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/core/theme/theme-provider";

import toast, { Toaster } from 'react-hot-toast';
import TanstackQueryClientProvider from "@/lib/query-client-provider";
import { SessionProvider } from 'next-auth/react';
import AuthProvider from "@/src/core/lib/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Face Analyzer | NuuhaBeauty",
  description: "Analyze your face and get personalized skincare recommendations",
  openGraph: {
    title: "AI Face Analyzer | NuuhaBeauty",
    description: "Analyze your face and get personalized skincare recommendations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Face Analyzer | NuuhaBeauty",
    description: "Analyze your face and get personalized skincare recommendations",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TanstackQueryClientProvider>
            {children}
          </TanstackQueryClientProvider>
          <Toaster />
          <SpeedInsights
            endpoint="https://analyze.nuuhabeauty.com/_vercel/speed-insights/vitals"
          />
          <Analytics />
        </AuthProvider >
      </body>
    </html>
  );
}
