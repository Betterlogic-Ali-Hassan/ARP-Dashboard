import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWithNotifications } from "@/components/layout-with-notifications"
import { TopNavbar } from "@/components/top-navbar"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Device Management Dashboard",
  description: "Manage your connected devices and settings profiles",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <TopNavbar />
            <div className="flex flex-1 pt-16">
              <Sidebar />
              <main className="flex-1 md:ml-64">
                <LayoutWithNotifications>{children}</LayoutWithNotifications>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
