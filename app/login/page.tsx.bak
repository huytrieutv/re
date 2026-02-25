// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "My App",
  description: "Built with v0 + Next.js + Supabase",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}