import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AI Spend Audit — Find out where you're overpaying on AI tools",
  description: "Free tool for startups to audit their AI tool spend. Find overspend, get recommendations, and save money.",
  openGraph: {
    title: "AI Spend Audit — Find out where you're overpaying on AI tools",
    description: "Free tool for startups to audit their AI tool spend. Find overspend, get recommendations, and save money.",
    url: "https://credex-audit-pink.vercel.app",
    siteName: "AI Spend Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit",
    description: "Find out where you're overpaying on AI tools. Free audit for startups.",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}