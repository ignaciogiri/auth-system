import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { createServerComponentClient } from "@/lib/supabase/server"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/app/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Social Commerce",
  description: "A social commerce platform built with Next.js and Supabase",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header session={session} />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
