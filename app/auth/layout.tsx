"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="bg-green-50 dark:bg-green-900/20 md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2 text-green-500"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <span className="font-bold text-xl">DeviceManager</span>
          </Link>

          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Manage your devices with ease</h1>
            <p className="text-muted-foreground mb-8">
              Securely access and control all your connected devices from anywhere in the world.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-1">Remote Control</h3>
                <p className="text-xs text-muted-foreground">Access your devices from anywhere</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-1">Real-time Monitoring</h3>
                <p className="text-xs text-muted-foreground">Track device status instantly</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-1">Secure Access</h3>
                <p className="text-xs text-muted-foreground">Enterprise-grade security</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-1">Custom Profiles</h3>
                <p className="text-xs text-muted-foreground">Create device settings profiles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DeviceManager. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="md:w-1/2 p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
